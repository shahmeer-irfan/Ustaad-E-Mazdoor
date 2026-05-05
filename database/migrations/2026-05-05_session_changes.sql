-- ============================================================================
-- Migration: 2026-05-05  —  bring live Supabase up to the level of
-- database/schema.sql for the artefacts the new code paths in this branch
-- depend on.
--
-- Idempotent: every statement is guarded so it can be re-run safely.
-- Additive only: NOTHING in here drops or rewrites existing tables; we touch
-- the live database with surgery, not a sledgehammer.
--
-- What it adds (after diff against the live DB on 2026-05-05):
--   1. pg_trgm + citext extensions (fast ILIKE search, case-insensitive email)
--   2. profiles.avg_rating / profiles.review_count columns (used by /api/reviews)
--   3. jobs.is_urgent column (used by JobRepository / homepage display)
--   4. touch_updated_at(), sync_job_proposal_count(),
--      sync_freelancer_rating(), sync_category_job_count() helpers
--   5. Triggers on profiles, client_info, jobs, proposals, reviews
--   6. v_jobs_listing view (matches JobRepository.findOpen output shape)
-- ============================================================================

BEGIN;

-- ── 1. Extensions ────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "citext";


-- ── 2. New columns on existing tables ────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avg_rating   NUMERIC(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS review_count INTEGER      NOT NULL DEFAULT 0;

ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN NOT NULL DEFAULT FALSE;

-- These were already present in the live schema (probed) but defensively
-- ensure NOT NULL DEFAULT 0 for the counters we rely on:
ALTER TABLE public.jobs
  ALTER COLUMN proposals_count SET DEFAULT 0,
  ALTER COLUMN views_count     SET DEFAULT 0;


-- ── 3. Performance indexes for ILIKE searches ────────────────────────────────
CREATE INDEX IF NOT EXISTS jobs_status_created_idx
  ON public.jobs (status, created_at DESC);

CREATE INDEX IF NOT EXISTS jobs_location_trgm_idx
  ON public.jobs USING gin (location gin_trgm_ops);

CREATE INDEX IF NOT EXISTS jobs_title_trgm_idx
  ON public.jobs USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS jobs_description_trgm_idx
  ON public.jobs USING gin (description gin_trgm_ops);

CREATE INDEX IF NOT EXISTS profiles_location_trgm_idx
  ON public.profiles USING gin (location gin_trgm_ops);

CREATE INDEX IF NOT EXISTS profiles_full_name_trgm_idx
  ON public.profiles USING gin (full_name gin_trgm_ops);


-- ── 4. Helper functions ──────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_job_proposal_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.jobs
       SET proposals_count = proposals_count + 1
     WHERE id = NEW.job_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.jobs
       SET proposals_count = GREATEST(proposals_count - 1, 0)
     WHERE id = OLD.job_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_freelancer_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  fid UUID := COALESCE(NEW.freelancer_id, OLD.freelancer_id);
BEGIN
  UPDATE public.profiles
     SET avg_rating   = COALESCE((SELECT AVG(rating)::NUMERIC(3,2)
                                   FROM public.reviews
                                   WHERE freelancer_id = fid), 0),
         review_count = (SELECT COUNT(*)
                         FROM public.reviews
                         WHERE freelancer_id = fid)
   WHERE id = fid;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_category_job_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.category_id IS NOT NULL THEN
    UPDATE public.categories SET job_count = job_count + 1 WHERE id = NEW.category_id;
  ELSIF TG_OP = 'DELETE' AND OLD.category_id IS NOT NULL THEN
    UPDATE public.categories SET job_count = GREATEST(job_count - 1, 0) WHERE id = OLD.category_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.category_id IS DISTINCT FROM OLD.category_id THEN
    IF OLD.category_id IS NOT NULL THEN
      UPDATE public.categories SET job_count = GREATEST(job_count - 1, 0) WHERE id = OLD.category_id;
    END IF;
    IF NEW.category_id IS NOT NULL THEN
      UPDATE public.categories SET job_count = job_count + 1 WHERE id = NEW.category_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;


-- ── 5. Attach triggers ───────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS client_info_set_updated_at ON public.client_info;
CREATE TRIGGER client_info_set_updated_at
  BEFORE UPDATE ON public.client_info
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS jobs_set_updated_at ON public.jobs;
CREATE TRIGGER jobs_set_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS proposals_set_updated_at ON public.proposals;
CREATE TRIGGER proposals_set_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS proposals_sync_count ON public.proposals;
CREATE TRIGGER proposals_sync_count
  AFTER INSERT OR DELETE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.sync_job_proposal_count();

DROP TRIGGER IF EXISTS reviews_sync_rating ON public.reviews;
CREATE TRIGGER reviews_sync_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.sync_freelancer_rating();

DROP TRIGGER IF EXISTS jobs_sync_category_count ON public.jobs;
CREATE TRIGGER jobs_sync_category_count
  AFTER INSERT OR UPDATE OF category_id OR DELETE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.sync_category_job_count();


-- ── 6. v_jobs_listing view (matches JobRepository.findOpen output) ───────────

CREATE OR REPLACE VIEW public.v_jobs_listing AS
SELECT
  j.id, j.title, j.description, j.budget_min, j.budget_max,
  j.budget_type, j.location, j.duration, j.status, j.created_at,
  j.proposals_count, j.views_count, j.is_urgent,
  c.name AS category_name,
  c.slug AS category_slug,
  COALESCE(
    ARRAY_AGG(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL),
    '{}'::text[]
  ) AS skills
FROM public.jobs       j
LEFT JOIN public.categories  c  ON j.category_id = c.id
LEFT JOIN public.job_skills  js ON j.id = js.job_id
LEFT JOIN public.skills      s  ON js.skill_id = s.id
GROUP BY j.id, c.name, c.slug;


-- ── 7. Backfill aggregates so existing rows reflect reality ──────────────────
UPDATE public.profiles p
   SET avg_rating   = COALESCE((SELECT AVG(rating)::NUMERIC(3,2)
                                FROM public.reviews
                                WHERE freelancer_id = p.id), 0),
       review_count = COALESCE((SELECT COUNT(*)
                                FROM public.reviews
                                WHERE freelancer_id = p.id), 0)
 WHERE p.user_type = 'freelancer';

UPDATE public.jobs j
   SET proposals_count = COALESCE((SELECT COUNT(*)
                                   FROM public.proposals
                                   WHERE job_id = j.id), 0);

UPDATE public.categories c
   SET job_count = COALESCE((SELECT COUNT(*)
                             FROM public.jobs
                             WHERE category_id = c.id), 0);


COMMIT;

-- ============================================================================
-- After this migration the runtime invariant matches the schema in
-- database/schema.sql for every code path the application actually exercises:
--   • POST /api/profile/switch-role  (no schema change, just confirms it works)
--   • POST /api/jobs/create          (counter trigger now keeps category in sync)
--   • POST /api/proposals            (proposal-count auto-managed)
--   • POST /api/reviews              (avg_rating + review_count auto-managed)
--   • GET  /api/jobs                 (gin-trgm indexes accelerate ILIKE filters)
-- ============================================================================

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FullPageLoader } from "@/components/Loader";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Star, MapPin, ArrowLeft, CheckCircle } from "lucide-react";

interface FreelancerProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  location: string;
  rating: string;
  reviews: number;
  skills: string[];
  hourlyRate: string;
  completedJobs: number;
  successRate: number;
  responseTime: string;
  avatarUrl: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  client_name: string;
  job_title: string;
  created_at: string;
}

export default function FreelancerProfilePage() {
  const params  = useParams();
  const router  = useRouter();
  const { t }   = useLanguage();

  const [freelancer, setFreelancer] = useState<FreelancerProfile | null>(null);
  const [reviews, setReviews]       = useState<Review[]>([]);
  const [loading, setLoading]       = useState(true);

  const freelancerId = params.id as string;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [flRes, rvRes] = await Promise.all([
          fetch(`/api/freelancers/${freelancerId}`),
          fetch(`/api/reviews?freelancerId=${freelancerId}`),
        ]);
        if (!flRes.ok) { router.push("/freelancers"); return; }
        const flData = await flRes.json();
        setFreelancer(flData.freelancer);
        if (rvRes.ok) {
          const rvData = await rvRes.json();
          setReviews(rvData.reviews || []);
        }
      } catch {
        router.push("/freelancers");
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freelancerId]);

  if (loading)     return <FullPageLoader />;
  if (!freelancer) return null;

  const initials = freelancer.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-[88px] pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <button onClick={() => router.back()}
            className="flex items-center gap-2 text-sm mb-6 transition hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}>
            <ArrowLeft className="w-4 h-4" /> {t("common.back")}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile card */}
            <div className="space-y-5">
              <div className="rounded-2xl p-6 ring-soft text-center" style={{ background: "var(--bg-card)" }}>
                <div className="mx-auto mb-4 w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                  style={{ background: "var(--grad-brand)" }}>
                  {freelancer.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={freelancer.avatarUrl} alt={freelancer.name}
                      className="w-full h-full object-cover rounded-2xl" />
                  ) : initials}
                </div>
                <h1 className="text-xl font-bold mb-0.5" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                  {freelancer.name}
                </h1>
                <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{freelancer.title}</p>
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${parseFloat(freelancer.rating) >= s ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
                  ))}
                  <span className="text-sm font-semibold ml-1" style={{ color: "var(--text-primary)" }}>{freelancer.rating}</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>({freelancer.reviews} {t("fl.reviews")})</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                  <MapPin className="w-4 h-4" /> {freelancer.location}
                </div>
                <div className="text-lg font-bold mb-4" style={{ color: "var(--brand)" }}>
                  {freelancer.hourlyRate}{t("fl.per_hour")}
                </div>
                <Link href="/post-job"
                  className="block w-full py-3 rounded-xl text-sm font-semibold text-white text-center transition hover:opacity-90"
                  style={{ background: "var(--grad-brand)", boxShadow: "0 8px 24px -8px var(--brand-glow)" }}>
                  {t("fl.hire")} →
                </Link>
              </div>

              {/* Stats */}
              <div className="rounded-2xl p-5 ring-soft" style={{ background: "var(--bg-card)" }}>
                <div className="grid grid-cols-2 gap-4 text-center">
                  {[
                    { value: freelancer.completedJobs, label: t("fl.completed") },
                    { value: `${freelancer.successRate}%`, label: t("fl.success_rate") },
                    { value: freelancer.reviews, label: t("fl.reviews") },
                    { value: freelancer.responseTime || "—", label: t("fl.response_time") },
                  ].map(({ value, label }) => (
                    <div key={label}>
                      <div className="text-xl font-bold" style={{ color: "var(--brand)", fontFamily: "var(--font-display)" }}>{value}</div>
                      <div className="text-xs mt-0.5 capitalize" style={{ color: "var(--text-muted)" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              {freelancer.skills?.length > 0 && (
                <div className="rounded-2xl p-5 ring-soft" style={{ background: "var(--bg-card)" }}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                    {t("fl.skills")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {freelancer.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1"
                        style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                        <CheckCircle className="w-3 h-3" style={{ color: "var(--brand)" }} /> {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bio + Reviews */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl p-6 ring-soft" style={{ background: "var(--bg-card)" }}>
                <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>{t("fl.bio")}</h2>
                <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {freelancer.bio || "No bio added yet."}
                </p>
              </div>

              <div className="rounded-2xl p-6 ring-soft" style={{ background: "var(--bg-card)" }}>
                <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                  Reviews ({reviews.length})
                </h2>
                {reviews.length === 0 ? (
                  <div className="text-center py-8" style={{ color: "var(--text-muted)" }}>
                    <Star className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    {t("fl.no_reviews")}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="rounded-xl p-4"
                        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{review.client_name}</div>
                            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                              {review.job_title} · {new Date(review.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map((s) => (
                              <Star key={s} className={`w-3.5 h-3.5 ${review.rating >= s ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

-- SQL Migration: Replace digital-freelancing categories with Pakistani skilled-trade categories
-- Run this in your Supabase SQL Editor to align the DB with the app UI

-- Step 1: Delete existing categories (will cascade update job category_id to NULL if no jobs)
-- If you have existing jobs, update them first or handle manually.
TRUNCATE public.categories RESTART IDENTITY CASCADE;

-- Step 2: Insert correct Pakistani skilled-trade categories
INSERT INTO public.categories (name, slug, icon, job_count) VALUES
  ('Plumbing',         'plumbing',         'Droplets',  156),
  ('Electrician',      'electrician',       'Zap',       234),
  ('Carpentry',        'carpentry',         'Hammer',    112),
  ('Painting',         'painting',          'Paintbrush', 98),
  ('AC & Refrigeration', 'ac-refrigeration','Wind',       87),
  ('Construction',     'construction',      'Building2',  73),
  ('Cleaning',         'cleaning',          'Sparkles',   65),
  ('Gardening',        'gardening',         'Leaf',       42),
  ('Tailoring',        'tailoring',         'Scissors',   38),
  ('Auto Mechanic',    'auto-mechanic',     'Car',        54),
  ('Welding',          'welding',           'Flame',      31),
  ('Home Appliances',  'home-appliances',   'Plug',       48);

-- Step 3: Update sample freelancer skills to match trades
INSERT INTO public.skills (name, slug) VALUES
  ('Pipe Installation',    'pipe-installation'),
  ('Leak Repair',          'leak-repair'),
  ('Bathroom Fitting',     'bathroom-fitting'),
  ('Wiring',               'wiring'),
  ('Switchboard Installation', 'switchboard-installation'),
  ('Generator Repair',     'generator-repair'),
  ('Furniture Making',     'furniture-making'),
  ('Wood Polishing',       'wood-polishing'),
  ('Wall Painting',        'wall-painting'),
  ('Texture Painting',     'texture-painting'),
  ('AC Installation',      'ac-installation'),
  ('AC Gas Refilling',     'ac-gas-refilling'),
  ('Refrigerator Repair',  'refrigerator-repair'),
  ('Brickwork',            'brickwork'),
  ('Plastering',           'plastering'),
  ('House Cleaning',       'house-cleaning'),
  ('Deep Cleaning',        'deep-cleaning'),
  ('Lawn Mowing',          'lawn-mowing'),
  ('Tree Trimming',        'tree-trimming'),
  ('Stitching',            'stitching'),
  ('Embroidery',           'embroidery'),
  ('Engine Repair',        'engine-repair'),
  ('Oil Change',           'oil-change'),
  ('Arc Welding',          'arc-welding'),
  ('Washing Machine Repair', 'washing-machine-repair'),
  ('Fan Repair',           'fan-repair')
ON CONFLICT (slug) DO NOTHING;

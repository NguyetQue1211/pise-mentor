-- Seed data for PISE Mentorship Portal MVP
-- Run after migration: 20260611000000_initial_schema.sql
--
-- Includes:
--   filter_options  — locations, disciplines, industries, support areas
--   app_config      — feedback_form_url placeholder

-- ============================================================
-- filter_options
-- ============================================================

insert into public.filter_options (type, slug, label, sort_order) values

-- Locations
('location', 'ho-chi-minh-city', 'Ho Chi Minh City',  10),
('location', 'hanoi',            'Hanoi',              20),
('location', 'vietnam',          'Vietnam',            30),
('location', 'singapore',        'Singapore',          40),
('location', 'united-states',    'United States',      50),
('location', 'remote-online',    'Remote / Online',    60),

-- Disciplines
('discipline', 'product-management',    'Product Management',    10),
('discipline', 'ux-research',           'UX Research',           20),
('discipline', 'ui-ux-design',          'UI/UX Design',          30),
('discipline', 'software-engineering',  'Software Engineering',  40),
('discipline', 'data-analytics',        'Data Analytics',        50),
('discipline', 'business-operations',   'Business Operations',   60),
('discipline', 'marketing',             'Marketing',             70),
('discipline', 'finance',               'Finance',               80),
('discipline', 'leadership',            'Leadership',            90),
('discipline', 'communication',         'Communication',        100),
('discipline', 'scholarship-preparation','Scholarship Preparation',110),
('discipline', 'career-orientation',    'Career Orientation',   120),

-- Industries
('industry', 'saas',                'SaaS',                   10),
('industry', 'technology',          'Technology',             20),
('industry', 'education',           'Education',              30),
('industry', 'non-profit-community','Non-profit / Community', 40),
('industry', 'start-up',            'Start-up',               50),
('industry', 'corporate',           'Corporate',              60),
('industry', 'consulting',          'Consulting',             70),
('industry', 'finance-investment',  'Finance / Investment',   80),
('industry', 'healthcare',          'Healthcare',             90),
('industry', 'manufacturing',       'Manufacturing',         100),
('industry', 'e-commerce',          'E-commerce',            110),

-- Support areas (display tags only; not a filter in MVP)
('support_area', 'career-orientation',           'Career orientation',           10),
('support_area', 'portfolio-preparation',         'Portfolio preparation',        20),
('support_area', 'university-application',        'University application',       30),
('support_area', 'scholarship-preparation',       'Scholarship preparation',      40),
('support_area', 'personal-development',          'Personal development',         50),
('support_area', 'leadership-development',        'Leadership development',       60),
('support_area', 'communication-skills',          'Communication skills',         70),
('support_area', 'study-skills',                  'Study skills',                 80),
('support_area', 'community-work',                'Community work',               90),
('support_area', 'early-career-decision-making',  'Early-career decision-making', 100)
on conflict (type, slug) do nothing;

-- ============================================================
-- app_config
-- ============================================================

insert into public.app_config (key, value, description)
values (
  'feedback_form_url',
  '',
  'External Google Form or Tally link shown to users for post-session feedback. Leave empty to hide the feedback link.'
)
on conflict (key) do nothing;

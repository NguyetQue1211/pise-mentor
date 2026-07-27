-- Simplify mentor classification fields
--
-- Removes the "discipline" field entirely (was labeled "Lĩnh vực" in the UI).
-- The former "industry" field is relabeled "Lĩnh vực" (data replaced with a new
-- industry list). The "support_area" field keeps its label "Lĩnh vực hỗ trợ"
-- but its content is replaced with the former discipline-style expertise list.
--
-- All existing mentor_profiles rows and filter_options rows are wiped and
-- reseeded — this is a deliberate full reset, not an additive change.

-- ============================================================
-- mentor_profiles: drop discipline_slugs column
-- ============================================================

drop index if exists public.mentor_profiles_discipline_slugs_idx;

alter table public.mentor_profiles drop column if exists discipline_slugs;

-- ============================================================
-- Wipe existing data
-- ============================================================

delete from public.mentor_profiles;
delete from public.filter_options;

-- ============================================================
-- Reseed filter_options
-- ============================================================

insert into public.filter_options (type, slug, label, sort_order) values

-- Locations (existing 6 + Poland, UK)
('location', 'ho-chi-minh-city', 'Ho Chi Minh City',  10),
('location', 'hanoi',            'Hanoi',              20),
('location', 'vietnam',          'Vietnam',            30),
('location', 'singapore',        'Singapore',          40),
('location', 'united-states',    'United States',      50),
('location', 'remote-online',    'Remote / Online',    60),
('location', 'poland',           'Ba Lan',             70),
('location', 'united-kingdom',   'UK',                 80),

-- "Lĩnh vực" (type=industry — replaces the old "Ngành nghề" content)
('industry', 'saas',                          'SaaS',                                  10),
('industry', 'technology',                    'Technology',                            20),
('industry', 'education',                     'Education',                             30),
('industry', 'ngos-nonprofits-community',     'NGOs/Nonprofits/Community',              40),
('industry', 'start-ups',                     'Start-ups',                              50),
('industry', 'multinational-corporation',     'Multinational Corporation',              60),
('industry', 'consulting',                    'Consulting',                             70),
('industry', 'finance-banking',               'Finance & Banking',                      80),
('industry', 'fmcg',                          'FMCG',                                   90),
('industry', 'e-commerce',                    'E-commerce',                            100),
('industry', 'human-resources',               'Human Resources',                       110),
('industry', 'retail',                        'Retail',                                120),
('industry', 'social-impact',                 'Social Impact',                         130),
('industry', 'public-sector-government',      'Public Sector / Government',            140),
('industry', 'international-relations',       'International Relations',               150),
('industry', 'global-affairs',                'Global Affairs',                        160),
('industry', 'youth-community-development',   'Youth & Community Development',         170),

-- "Lĩnh vực hỗ trợ" (type=support_area — replaces the old expertise/discipline content)
('support_area', 'product-management',            'Product Management',                                        10),
('support_area', 'ux-research',                   'UX Research',                                                20),
('support_area', 'ui-ux-design',                  'UI/UX Design',                                               30),
('support_area', 'software-engineering',          'Software Engineering',                                      40),
('support_area', 'data-analytics',                'Data Analytics',                                            50),
('support_area', 'business-operations',           'Business Operations',                                       60),
('support_area', 'marketing',                     'Marketing',                                                 70),
('support_area', 'communications',                'Communications',                                            80),
('support_area', 'scholarship-preparation',       'Scholarship Preparation',                                   90),
('support_area', 'career-orientation',            'Career Orientation',                                       100),
('support_area', 'computer-science',              'Computer Science',                                         110),
('support_area', 'psychology',                    'Psychology',                                               120),
('support_area', 'entrepreneurship-startups',     'Entrepreneurship/Startups',                                130),
('support_area', 'human-resources',               'Human Resources',                                          140),
('support_area', 'project-management',            'Project Management',                                       150),
('support_area', 'online-events',                 'Online Events',                                            160),
('support_area', 'international-relations',       'International Relations',                                  170),
('support_area', 'critical-thinking-debating',    'Critical Thinking & Debating Skills',                      180),
('support_area', 'leadership',                    'Leadership',                                                190),
('support_area', 'global-opportunities',          'Global Opportunities (Scholarships, Exchange & International Programs)', 200),
('support_area', 'scholarship-application-strategy', 'Scholarship & Application Strategy',                    210),
('support_area', 'cross-cultural-communication',  'Cross-cultural Communication',                             220),
('support_area', 'pitching',                      'Pitching',                                                  230),
('support_area', 'planning',                      'Planning',                                                  240),
('support_area', 'stakeholder-management',        'Stakeholder Management',                                   250)

on conflict (type, slug) do nothing;

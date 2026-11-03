insert into public.categories (name, slug, description, color_token, sort_order) values
  ('Success Stories','success-stories','Real hustles from across Kenya, told by the people living them.','primary',1),
  ('Safety and Escrow','safety-escrow','How escrow works and how to stay safe on every job.','primary',2),
  ('Skills and Business Tips','skills-business-tips','Pricing, paperwork, and running a tighter operation.','primary',3),
  ('Product Updates','product-updates','What shipped on HustlerLink, and what it changes for you.','accent',4),
  ('Community News','community-news','Meetups, partnerships, and news from the community.','muted',5),
  ('Help Center','help-center','Step by step answers for buyers, workers, and businesses.','muted',6),
  ('Developer Documentation','developer-documentation','Build on the HustlerLink platform.','muted',7),
  ('API Documentation','api-documentation','REST reference for the HustlerLink API.','muted',8),
  ('Investor Updates','investor-updates','Numbers, milestones, and plans, shared openly.','muted',9),
  ('Company Announcements','company-announcements','Announcements from the HustlerLink team.','muted',10),
  ('Legal and Policies','legal-policies','Terms, privacy, and platform policies in plain language.','muted',11),
  ('Knowledge Base','knowledge-base','Reference articles covering the whole platform.','muted',12);

insert into public.tags (name, slug) values
  ('Pricing','pricing'),('Escrow','escrow'),('Verification','verification'),
  ('Nairobi','nairobi'),('Milestone payments','milestone-payments'),('Fundis','fundis'),
  ('Small business','small-business'),('API','api'),('Trust','trust'),('Deposits','deposits');

insert into public.topics (name, slug, description, sort_order) values
  ('Pricing your work','pricing-your-work','How to set rates that keep you busy and profitable.',1),
  ('First-time buyer','first-time-buyer','Everything to know before your first HustlerLink job.',2),
  ('Scaling a fundi business','scaling-a-fundi-business','From solo jobs to a team with a waiting list.',3),
  ('Getting paid safely','getting-paid-safely','Escrow, milestones, and avoiding bad debts.',4);

insert into public.series (name, slug, description) values
  ('Start selling on HustlerLink in 5 steps','start-selling-on-hustlerlink','A short ordered series for workers setting up their first listing.');

insert into public.authors (name, slug, role_title, bio) values
  ('Amina Wanjiru','amina-wanjiru','Senior Editor','Amina leads the newsroom at Hustler Journal. She has spent eight years covering small business and work in East Africa. She believes clear information is the first form of respect.'),
  ('David Otieno','david-otieno','Staff Writer','David writes the guides and help center articles. He trained as an electrical engineer and ran his own repair shop in Kisumu before joining the newsroom.'),
  ('Grace Mutua','grace-mutua','Platform Reporter','Grace covers product updates, safety, and escrow. She interviews workers and buyers every week so the Journal reports what the platform actually does, not what it wishes it did.'),
  ('HustlerLink Team','hustlerlink-team','Company','Announcements and policy updates written and reviewed by the platform team.');

insert into public.site_settings (key, value) values
  ('site', '{"name":"Hustler Journal","tagline":"The official publication of HustlerLink","comments_enabled":false,"newsletter_enabled":true}'::jsonb),
  ('navigation', '{"header":["/stories","/guides","/safety","/updates","/news","/help","/developers"],"footer_ecosystem":true}'::jsonb);

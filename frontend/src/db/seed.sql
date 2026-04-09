CREATE TABLE IF NOT EXISTS authors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  bio TEXT,
  avatar TEXT
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  is_published INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (author_id) REFERENCES authors(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT OR IGNORE INTO authors (id, name, bio, avatar) VALUES
(1, 'Annabelle Rose', 'Fashion editor and lifestyle writer with a passion for minimalist aesthetics.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop'),
(2, 'Marcus Chen', 'Tech journalist covering design, culture, and innovation.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'),
(3, 'Sofia Laurent', 'Travel and food blogger exploring the world one city at a time.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop');

INSERT OR IGNORE INTO categories (id, name, slug) VALUES
(1, 'Fashion', 'fashion'),
(2, 'Lifestyle', 'lifestyle'),
(3, 'Travel', 'travel'),
(4, 'Design', 'design'),
(5, 'Culture', 'culture');

INSERT OR IGNORE INTO posts (id, title, slug, excerpt, content, featured_image, author_id, category_id, is_published, published_at) VALUES
(1, 'The Art of Minimalist Wardrobe', 'the-art-of-minimalist-wardrobe', 'Discover how a capsule wardrobe can transform your daily routine and redefine personal style.', '<h2>Less is More</h2><p>In a world overflowing with fast fashion, the minimalist wardrobe stands as a beacon of intentional living. A capsule wardrobe typically consists of 30-40 versatile pieces that can be mixed and matched to create countless outfits.</p><h2>Building Your Foundation</h2><p>Start with neutral basics: a crisp white shirt, well-fitted dark jeans, a tailored blazer, and quality leather accessories. These timeless pieces form the backbone of any sophisticated wardrobe.</p><p>The key is investing in quality over quantity. A single well-made coat will outlast and outperform five cheap alternatives.</p>', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&h=500&fit=crop', 1, 1, 1, '2024-12-15T10:00:00'),
(2, 'Tokyo Design Week Highlights', 'tokyo-design-week-highlights', 'A curated look at the most innovative installations and emerging designers from this year''s Tokyo Design Week.', '<h2>Innovation Meets Tradition</h2><p>Tokyo Design Week continues to push boundaries, blending cutting-edge technology with traditional Japanese craftsmanship. This year''s edition featured over 200 exhibitors from 30 countries.</p><h2>Standout Pieces</h2><p>The highlight was undoubtedly the interactive light installation by Studio Drift, which responded to visitors'' movements to create a flowing, organic light sculpture that filled the main hall.</p><p>Emerging designer Yuki Tanaka presented a furniture collection made entirely from recycled ocean plastics, proving that sustainability and beauty are not mutually exclusive.</p>', 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=500&fit=crop', 2, 4, 1, '2024-12-18T14:30:00'),
(3, 'Hidden Gems of the Amalfi Coast', 'hidden-gems-amalfi-coast', 'Beyond the tourist trails, the Amalfi Coast holds secrets that only locals know. Here are five places you won''t find in guidebooks.', '<h2>Off the Beaten Path</h2><p>While Positano and Ravello draw millions of visitors each year, the Amalfi Coast has a quieter, more authentic side waiting to be discovered. These hidden spots offer the same stunning views without the crowds.</p><h2>The Secret Beach of Furore</h2><p>Nestled between towering cliffs, the fjord of Furore hides a tiny beach that feels like stepping into another world. The crystal-clear water and dramatic rock formations make it one of Italy''s best-kept secrets.</p><p>Local fishermen still launch their boats from this spot each morning, carrying on a tradition that dates back centuries.</p>', 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&h=500&fit=crop', 3, 3, 1, '2024-12-20T09:00:00'),
(4, 'The Rise of Slow Living', 'the-rise-of-slow-living', 'Why more people are choosing to decelerate and what the slow living movement means for modern culture.', '<h2>A Counter-Movement</h2><p>In our hyper-connected, always-on world, a growing number of people are choosing to slow down. The slow living movement isn''t about doing everything at a snail''s pace—it''s about being intentional with your time and energy.</p><h2>Practical Steps</h2><p>Start your morning without checking your phone. Cook a meal from scratch. Take the scenic route home. These small changes compound into a fundamentally different relationship with time.</p><p>Research shows that people who practice mindful deceleration report higher life satisfaction and lower stress levels.</p>', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop', 1, 2, 1, '2024-12-22T11:00:00'),
(5, 'Street Style Report: Paris Fashion Week', 'street-style-paris-fw', 'The best looks spotted outside the shows during Paris Fashion Week, from bold layering to quiet luxury.', '<h2>The Streets as Runway</h2><p>Paris Fashion Week isn''t just about what happens inside the venues. The streets of the Marais and Saint-Germain transform into an open-air fashion show, where editors, buyers, and influencers showcase their personal style.</p><h2>Key Trends Spotted</h2><p>This season, the dominant theme was contrast: oversized outerwear paired with delicate accessories, utilitarian fabrics mixed with haute couture details. The ''quiet luxury'' movement was evident in the abundance of unlogged leather goods and cashmere layers.</p>', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=500&fit=crop', 2, 1, 1, '2024-12-25T16:00:00');
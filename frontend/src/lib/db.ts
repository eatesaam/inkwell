import path from 'path';

let db: any = null;

export function getDb() {
  if (db) return db;
  const Database = require('better-sqlite3');
  const dbPath = process.env.SQLITE_DB_PATH || '/tmp/inkwell.db';
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  initTables(db);
  return db;
}

function initTables(db: any) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS authors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      bio TEXT DEFAULT '',
      avatar TEXT DEFAULT '',
      email TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      featured_image TEXT DEFAULT '',
      author_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      is_published INTEGER NOT NULL DEFAULT 0,
      published_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (author_id) REFERENCES authors(id),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
  `);
  // Seed if empty
  const count = db.prepare('SELECT COUNT(*) as c FROM authors').get();
  if (count.c === 0) {
    db.exec(`
      INSERT OR IGNORE INTO authors (id, name, bio, avatar, email) VALUES
        (1, 'Annabelle Laurent', 'Fashion writer and creative director with 10 years of experience in editorial storytelling.', '', 'annabelle@inkwell.com'),
        (2, 'Marcus Chen', 'Tech and culture journalist covering the intersection of design and innovation.', '', 'marcus@inkwell.com'),
        (3, 'Sofia Rivera', 'Travel and lifestyle blogger passionate about sustainable living.', '', 'sofia@inkwell.com');

      INSERT OR IGNORE INTO categories (id, name, slug, description) VALUES
        (1, 'Fashion', 'fashion', 'Latest trends and style guides'),
        (2, 'Technology', 'technology', 'Innovation and digital culture'),
        (3, 'Travel', 'travel', 'Destinations and experiences'),
        (4, 'Lifestyle', 'lifestyle', 'Daily inspiration and wellness');

      INSERT OR IGNORE INTO posts (id, title, slug, excerpt, content, featured_image, author_id, category_id, is_published, published_at) VALUES
        (1, 'The Art of Minimalist Wardrobe', 'the-art-of-minimalist-wardrobe', 'Discover how to build a timeless capsule wardrobe that speaks volumes with less.', '<h2>Less Is More</h2><p>In a world of fast fashion, the minimalist wardrobe stands as a beacon of intentional living. A capsule wardrobe isn''t about deprivation—it''s about curation.</p><p>Start with neutral foundations: a well-fitted blazer, quality denim, and versatile knits. Add accent pieces that reflect your personality.</p><h2>Building Your Foundation</h2><p>The key is investing in quality over quantity. Choose fabrics that last, fits that flatter, and colors that mix effortlessly.</p>', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=500&fit=crop', 1, 1, 1, '2024-12-15T10:00:00'),
        (2, 'AI and the Future of Creative Design', 'ai-future-creative-design', 'How artificial intelligence is reshaping the creative landscape without replacing human artistry.', '<h2>The Creative Revolution</h2><p>AI tools are not replacing designers—they''re amplifying creativity. From generative art to intelligent layout systems, the fusion of human intuition and machine capability is producing extraordinary results.</p><h2>Finding Balance</h2><p>The most compelling work emerges when creators use AI as a collaborator, not a replacement. The human eye for emotion and context remains irreplaceable.</p>', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop', 2, 2, 1, '2024-12-20T14:00:00'),
        (3, 'Hidden Gems of the Portuguese Coast', 'hidden-gems-portuguese-coast', 'Beyond Lisbon and Porto, Portugal''s coastline holds breathtaking secrets waiting to be discovered.', '<h2>The Alentejo Coast</h2><p>Far from the tourist crowds, the Alentejo coastline offers rugged cliffs, pristine beaches, and charming fishing villages. The Rota Vicentina hiking trail winds through some of Europe''s most unspoiled landscapes.</p><h2>Practical Tips</h2><p>Visit in shoulder season (May or September) for perfect weather and fewer crowds. Rent a car to explore the smaller coastal towns.</p>', 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=500&fit=crop', 3, 3, 1, '2025-01-05T09:00:00'),
        (4, 'Morning Rituals for a Productive Day', 'morning-rituals-productive-day', 'Simple habits that transform your mornings and set the tone for success.', '<h2>The Power of Routine</h2><p>How you start your morning shapes your entire day. Research shows that consistent morning routines reduce decision fatigue and increase overall productivity.</p><h2>Five Essential Habits</h2><p>1. Wake at a consistent time. 2. Hydrate before caffeine. 3. Move your body for 15 minutes. 4. Journal or meditate. 5. Plan your top three priorities.</p>', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop', 3, 4, 1, '2025-01-10T07:00:00'),
        (5, 'Street Style: Tokyo Edition', 'street-style-tokyo', 'A visual journey through Harajuku and Shibuya''s most inspiring fashion moments.', '<h2>Harajuku Dreams</h2><p>Tokyo street style is a masterclass in self-expression. From layered avant-garde silhouettes to perfectly curated vintage finds, every neighborhood tells a different fashion story.</p>', 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&h=500&fit=crop', 1, 1, 1, '2025-01-15T12:00:00');
    `);
  }
}
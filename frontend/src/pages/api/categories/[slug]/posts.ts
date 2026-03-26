import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  const { slug } = req.query;
  const cat = db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug);
  if (!cat) return res.json([]);
  const posts = db.prepare('SELECT p.*, a.name as author_name, c.name as category_name FROM posts p LEFT JOIN authors a ON p.author_id = a.id LEFT JOIN categories c ON p.category_id = c.id WHERE p.category_id = ? AND p.is_published = 1 ORDER BY p.created_at DESC').all((cat as any).id);
  return res.json(posts);
}
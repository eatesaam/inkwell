import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  const q = String(req.query.q || '').replace(/'/g, "''");
  if (!q) return res.json([]);
  const posts = db.prepare(`SELECT p.*, a.name as author_name, c.name as category_name FROM posts p LEFT JOIN authors a ON p.author_id = a.id LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_published = 1 AND (p.title LIKE '%${q}%' OR p.excerpt LIKE '%${q}%' OR p.content LIKE '%${q}%') ORDER BY p.created_at DESC`).all();
  return res.json(posts);
}
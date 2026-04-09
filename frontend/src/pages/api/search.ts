import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  const q = (req.query.q as string) || '';
  if (!q) return res.json([]);
  const posts = db.prepare(
    `SELECT p.*, a.name as author_name, a.avatar as author_avatar
     FROM posts p JOIN authors a ON p.author_id = a.id
     WHERE p.is_published = 1 AND (p.title LIKE ? OR p.excerpt LIKE ? OR p.content LIKE ?)
     ORDER BY p.created_at DESC`
  ).all(`%${q}%`, `%${q}%`, `%${q}%`);
  return res.json(posts);
}
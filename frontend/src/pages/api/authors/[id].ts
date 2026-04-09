import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  const { id } = req.query;
  const author = db.prepare('SELECT * FROM authors WHERE id = ?').get(id);
  if (!author) return res.status(404).json({ error: 'Not found' });
  const posts = db.prepare(
    'SELECT * FROM posts WHERE author_id = ? AND is_published = 1 ORDER BY created_at DESC'
  ).all(id);
  return res.json({ ...author, posts });
}
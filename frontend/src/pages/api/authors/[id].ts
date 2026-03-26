import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  const id = Number(req.query.id);

  if (req.method === 'GET') {
    const author = db.prepare('SELECT * FROM authors WHERE id = ?').get(id);
    if (!author) return res.status(404).json({ error: 'Not found' });
    const posts = db.prepare('SELECT p.*, c.name as category_name FROM posts p LEFT JOIN categories c ON p.category_id = c.id WHERE p.author_id = ? AND p.is_published = 1 ORDER BY p.created_at DESC').all(id);
    return res.json({ ...(author as any), posts });
  }
  if (req.method === 'PUT') {
    const { name, email, bio, avatar } = req.body;
    db.prepare('UPDATE authors SET name=?, email=?, bio=?, avatar=? WHERE id=?').run(name, email, bio || '', avatar || '', id);
    return res.json({ id, ...req.body });
  }
  if (req.method === 'DELETE') {
    db.prepare('DELETE FROM authors WHERE id=?').run(id);
    return res.status(204).end();
  }
  res.status(405).end();
}
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  const { slug } = req.query;
  const id = Number(slug);

  if (req.method === 'PUT') {
    const { name, slug: newSlug, description } = req.body;
    db.prepare('UPDATE categories SET name=?, slug=?, description=? WHERE id=?').run(name, newSlug, description || '', id);
    return res.json({ id, name, slug: newSlug, description });
  }
  if (req.method === 'DELETE') {
    db.prepare('DELETE FROM categories WHERE id=?').run(id);
    return res.status(204).end();
  }
  res.status(405).end();
}
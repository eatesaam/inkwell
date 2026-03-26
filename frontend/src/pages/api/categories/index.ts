import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  if (req.method === 'GET') {
    return res.json(db.prepare('SELECT * FROM categories ORDER BY name').all());
  }
  if (req.method === 'POST') {
    const { name, slug, description } = req.body;
    const r = db.prepare('INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)').run(name, slug, description || '');
    return res.json({ id: r.lastInsertRowid, name, slug, description });
  }
  res.status(405).end();
}
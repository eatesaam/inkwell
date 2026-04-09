import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();

  if (req.method === 'GET') {
    const cats = db.prepare('SELECT * FROM categories ORDER BY name').all();
    return res.json(cats);
  }

  if (req.method === 'POST') {
    const { name, slug } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'Missing fields' });
    const result = db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)').run(name, slug);
    const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json(cat);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
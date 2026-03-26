import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  if (req.method === 'GET') {
    return res.json(db.prepare('SELECT * FROM authors ORDER BY name').all());
  }
  if (req.method === 'POST') {
    const { name, email, bio, avatar } = req.body;
    const r = db.prepare('INSERT INTO authors (name, email, bio, avatar) VALUES (?, ?, ?, ?)').run(name, email, bio || '', avatar || '');
    return res.json({ id: r.lastInsertRowid, name, email, bio, avatar });
  }
  res.status(405).end();
}
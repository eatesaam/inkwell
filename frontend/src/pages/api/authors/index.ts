import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  const authors = db.prepare('SELECT * FROM authors ORDER BY name').all();
  return res.json(authors);
}
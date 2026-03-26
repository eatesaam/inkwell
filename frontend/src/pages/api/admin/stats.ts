import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  const posts = (db.prepare('SELECT COUNT(*) as c FROM posts').get() as any).c;
  const categories = (db.prepare('SELECT COUNT(*) as c FROM categories').get() as any).c;
  const authors = (db.prepare('SELECT COUNT(*) as c FROM authors').get() as any).c;
  res.json({ total_posts: posts, total_categories: categories, total_authors: authors });
}
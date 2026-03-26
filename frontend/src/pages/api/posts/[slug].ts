import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  const { slug } = req.query;

  if (req.method === 'GET') {
    // Try slug first, then id
    let post = db.prepare('SELECT p.*, a.name as author_name, c.name as category_name FROM posts p LEFT JOIN authors a ON p.author_id = a.id LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ?').get(slug);
    if (!post) {
      post = db.prepare('SELECT p.*, a.name as author_name, c.name as category_name FROM posts p LEFT JOIN authors a ON p.author_id = a.id LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?').get(Number(slug));
    }
    if (!post) return res.status(404).json({ error: 'Not found' });
    return res.json(post);
  }

  if (req.method === 'PUT') {
    const id = Number(slug);
    const { title, slug: newSlug, excerpt, content, featured_image, author_id, category_id, is_published } = req.body;
    const now = new Date().toISOString();
    db.prepare(
      'UPDATE posts SET title=?, slug=?, excerpt=?, content=?, featured_image=?, author_id=?, category_id=?, is_published=?, published_at=CASE WHEN ?=1 AND published_at IS NULL THEN ? ELSE published_at END, updated_at=? WHERE id=?'
    ).run(title, newSlug, excerpt, content, featured_image || '', author_id, category_id, is_published ? 1 : 0, is_published ? 1 : 0, now, now, id);
    return res.json({ id, ...req.body });
  }

  if (req.method === 'DELETE') {
    db.prepare('DELETE FROM posts WHERE id = ?').run(Number(slug));
    return res.status(204).end();
  }

  res.status(405).end();
}
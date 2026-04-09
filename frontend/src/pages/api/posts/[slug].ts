import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();
  const { slug } = req.query;
  const byId = req.query.by_id === 'true';

  if (req.method === 'GET') {
    let post;
    if (byId) {
      post = db.prepare(
        `SELECT p.*, a.name as author_name, a.avatar as author_avatar FROM posts p JOIN authors a ON p.author_id = a.id WHERE p.id = ?`
      ).get(slug);
    } else {
      post = db.prepare(
        `SELECT p.*, a.name as author_name, a.avatar as author_avatar FROM posts p JOIN authors a ON p.author_id = a.id WHERE p.slug = ?`
      ).get(slug);
    }
    if (!post) return res.status(404).json({ error: 'Not found' });
    return res.json(post);
  }

  if (req.method === 'PUT') {
    const { title, slug: newSlug, excerpt, content, featured_image, author_id, category_id, is_published } = req.body;
    const now = new Date().toISOString();
    const published_at = is_published ? now : null;
    db.prepare(
      `UPDATE posts SET title=?, slug=?, excerpt=?, content=?, featured_image=?, author_id=?, category_id=?, is_published=?, published_at=COALESCE(?, published_at), updated_at=? WHERE id=?`
    ).run(title, newSlug, excerpt, content, featured_image || null, author_id, category_id, is_published ? 1 : 0, published_at, now, slug);
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(slug);
    return res.json(post);
  }

  if (req.method === 'DELETE') {
    db.prepare('DELETE FROM posts WHERE id = ?').run(slug);
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
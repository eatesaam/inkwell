import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();

  if (req.method === 'GET') {
    const { category, all, search } = req.query;
    let sql = `SELECT p.*, a.name as author_name, a.avatar as author_avatar, c.name as category_name, c.slug as category_slug
               FROM posts p JOIN authors a ON p.author_id = a.id JOIN categories c ON p.category_id = c.id`;
    const conditions: string[] = [];
    const params: any[] = [];

    if (all !== 'true') {
      conditions.push('p.is_published = 1');
    }
    if (category) {
      conditions.push('c.slug = ?');
      params.push(category);
    }
    if (search) {
      conditions.push('(p.title LIKE ? OR p.excerpt LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY p.created_at DESC';

    const posts = db.prepare(sql).all(...params);
    return res.json(posts);
  }

  if (req.method === 'POST') {
    const { title, slug, excerpt, content, featured_image, author_id, category_id, is_published } = req.body;
    if (!title || !slug || !excerpt || !content) return res.status(400).json({ error: 'Missing fields' });
    const now = new Date().toISOString();
    const published_at = is_published ? now : null;
    const result = db.prepare(
      `INSERT INTO posts (title, slug, excerpt, content, featured_image, author_id, category_id, is_published, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(title, slug, excerpt, content, featured_image || null, author_id || 1, category_id || 1, is_published ? 1 : 0, published_at, now, now);
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json(post);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
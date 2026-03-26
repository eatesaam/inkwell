import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = getDb();

  if (req.method === 'GET') {
    const { all, limit, category_id, search } = req.query;
    let sql = `SELECT p.*, a.name as author_name, c.name as category_name FROM posts p LEFT JOIN authors a ON p.author_id = a.id LEFT JOIN categories c ON p.category_id = c.id`;
    const conditions: string[] = [];
    if (!all) conditions.push('p.is_published = 1');
    if (category_id) conditions.push(`p.category_id = ${Number(category_id)}`);
    if (search) conditions.push(`(p.title LIKE '%${String(search).replace(/'/g, "''")}%' OR p.excerpt LIKE '%${String(search).replace(/'/g, "''")}%')`);
    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY p.created_at DESC';
    if (limit) sql += ` LIMIT ${Number(limit)}`;
    const posts = db.prepare(sql).all();
    return res.json(posts);
  }

  if (req.method === 'POST') {
    const { title, slug, excerpt, content, featured_image, author_id, category_id, is_published } = req.body;
    const now = new Date().toISOString();
    const result = db.prepare(
      'INSERT INTO posts (title, slug, excerpt, content, featured_image, author_id, category_id, is_published, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(title, slug, excerpt || '', content || '', featured_image || '', author_id, category_id, is_published ? 1 : 0, is_published ? now : null, now, now);
    return res.json({ id: result.lastInsertRowid, ...req.body });
  }

  res.status(405).end();
}
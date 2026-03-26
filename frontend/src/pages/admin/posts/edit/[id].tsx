import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import AppLayout from '@/components/layout/AppLayout';
import apiClient from '@/lib/api';
import { FiArrowLeft } from 'react-icons/fi';
import styles from '@/styles/Admin.module.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function AdminPostEdit() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState<any>(null);
  const [authors, setAuthors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    apiClient.get(`/api/posts?all=true`).then(r => {
      const post = r.data.find((p: any) => p.id === Number(id));
      if (post) setForm({ ...post, author_id: String(post.author_id), category_id: String(post.category_id) });
    });
    apiClient.get('/api/authors').then(r => setAuthors(r.data));
    apiClient.get('/api/categories').then(r => setCategories(r.data));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiClient.put(`/api/posts/${id}`, { ...form, author_id: Number(form.author_id), category_id: Number(form.category_id) });
    router.push('/admin/posts');
  };

  if (!form) return <AppLayout isAdmin><p style={{ padding: 32 }}>Loading...</p></AppLayout>;

  return (
    <AppLayout isAdmin>
      <Link href="/admin/posts" className={styles.subtitle} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}><FiArrowLeft size={14} /> Back to posts</Link>
      <h1 style={{ marginBottom: 20 }}>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formCard}>
          <div className={styles.formGrid}>
            <div className={styles.field}><label>Title</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className={styles.field}><label>Slug</label><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></div>
            <div className={styles.field}><label>Author</label><select required value={form.author_id} onChange={e => setForm({ ...form, author_id: e.target.value })}><option value="">Select...</option>{authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
            <div className={styles.field}><label>Category</label><select required value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}><option value="">Select...</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div className={`${styles.field} ${styles.full}`}><label>Featured Image URL</label><input value={form.featured_image || ''} onChange={e => setForm({ ...form, featured_image: e.target.value })} /></div>
            <div className={`${styles.field} ${styles.full}`}><label>Excerpt</label><textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} /></div>
            <div className={`${styles.field} ${styles.full}`}>
              <label>Content</label>
              <ReactQuill theme="snow" value={form.content} onChange={v => setForm({ ...form, content: v })} style={{ minHeight: 200 }} />
            </div>
            <div className={styles.field}>
              <label style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} /> Published
              </label>
            </div>
          </div>
        </div>
        <div className={styles.btnRow}>
          <button type="submit" className={styles.primaryBtn}>Save Changes</button>
          <Link href="/admin/posts" className={styles.outlineBtn}>Cancel</Link>
        </div>
      </form>
    </AppLayout>
  );
}
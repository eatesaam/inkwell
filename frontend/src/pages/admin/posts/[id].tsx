import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import apiClient from '@/lib/api';
import styles from '@/styles/admin.module.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function AdminPostEditor() {
  const router = useRouter();
  const { id } = router.query;
  const isNew = id === 'new';

  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', featured_image: '',
    author_id: 1, category_id: 1, is_published: false,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiClient.get('/api/categories').then(r => setCategories(r.data));
    apiClient.get('/api/authors').then(r => setAuthors(r.data));
  }, []);

  useEffect(() => {
    if (!id || isNew) return;
    apiClient.get(`/api/posts/${id}?by_id=true`).then(r => {
      const p = r.data;
      setForm({
        title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content,
        featured_image: p.featured_image || '', author_id: p.author_id,
        category_id: p.category_id, is_published: !!p.is_published,
      });
    });
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'title' && (isNew || form.slug === '')) {
      setForm(prev => ({ ...prev, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await apiClient.post('/api/posts', form);
      } else {
        await apiClient.put(`/api/posts/${id}`, form);
      }
      router.push('/admin/posts');
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  }), []);

  return (
    <div>
      <Link href="/admin/posts" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-secondary)', marginBottom: 20 }}><FiArrowLeft /> Back to Posts</Link>
      <h1 className={styles.pageTitle}>{isNew ? 'New Post' : 'Edit Post'}</h1>
      <form onSubmit={handleSave} className={styles.editorForm} style={{ marginTop: 20 }}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Title</label>
          <input className={styles.input} value={form.title} onChange={e => handleChange('title', e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Slug</label>
          <input className={styles.input} value={form.slug} onChange={e => handleChange('slug', e.target.value)} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Author</label>
            <select className={styles.select} value={form.author_id} onChange={e => handleChange('author_id', Number(e.target.value))}>
              {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Category</label>
            <select className={styles.select} value={form.category_id} onChange={e => handleChange('category_id', Number(e.target.value))}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Featured Image URL</label>
          <input className={styles.input} value={form.featured_image} onChange={e => handleChange('featured_image', e.target.value)} placeholder="https://..." />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Excerpt</label>
          <textarea className={styles.input} rows={3} value={form.excerpt} onChange={e => handleChange('excerpt', e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Content</label>
          <div className={styles.editorWrap}>
            <ReactQuill theme="snow" value={form.content} onChange={(v: string) => handleChange('content', v)} modules={modules} />
          </div>
        </div>
        <div className={styles.checkRow}>
          <input type="checkbox" id="published" checked={form.is_published} onChange={e => handleChange('is_published', e.target.checked)} />
          <label htmlFor="published" style={{ fontSize: 14 }}>Published</label>
        </div>
        <div className={styles.btnRow}>
          <button type="submit" className={styles.primaryBtn} disabled={saving}><FiSave /> {saving ? 'Saving...' : 'Save Post'}</button>
          <Link href="/admin/posts" className={styles.secondaryBtn}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}
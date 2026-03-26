import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import apiClient from '@/lib/api';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import styles from '@/styles/Admin.module.css';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });

  const load = () => apiClient.get('/api/categories').then(r => setCategories(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (editing) {
      await apiClient.put(`/api/categories/${editing.id}`, { ...form, slug });
    } else {
      await apiClient.post('/api/categories', { ...form, slug });
    }
    setForm({ name: '', slug: '', description: '' });
    setEditing(null);
    load();
  };

  const handleEdit = (c: any) => { setEditing(c); setForm({ name: c.name, slug: c.slug, description: c.description || '' }); };
  const handleDelete = async (id: number) => { if (confirm('Delete?')) { await apiClient.delete(`/api/categories/${id}`); load(); } };

  return (
    <AppLayout isAdmin>
      <div className={styles.header}><div><h1>Categories</h1><p className={styles.subtitle}>Manage blog categories</p></div></div>
      <div className={styles.formCard}>
        <h3 style={{ marginBottom: 12 }}>{editing ? 'Edit Category' : 'New Category'}</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.field}><label>Name</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className={styles.field}><label>Slug</label><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Auto from name" /></div>
            <div className={`${styles.field} ${styles.full}`}><label>Description</label><input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          </div>
          <div className={styles.btnRow}>
            <button type="submit" className={styles.primaryBtn}>{editing ? 'Update' : 'Create'}</button>
            {editing && <button type="button" className={styles.outlineBtn} onClick={() => { setEditing(null); setForm({ name: '', slug: '', description: '' }); }}><FiX size={14} /> Cancel</button>}
          </div>
        </form>
      </div>
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead><tr><th>Name</th><th>Slug</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td>{c.slug}</td>
                <td>{c.description || '—'}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleEdit(c)} style={{ color: '#1976D2' }}><FiEdit2 size={16} /></button>
                  <button onClick={() => handleDelete(c.id)} style={{ color: '#DC2626' }}><FiTrash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
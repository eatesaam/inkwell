import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import apiClient from '@/lib/api';
import { FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import styles from '@/styles/Admin.module.css';

export default function AdminAuthors() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', bio: '', avatar: '' });

  const load = () => apiClient.get('/api/authors').then(r => setAuthors(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await apiClient.put(`/api/authors/${editing.id}`, form);
    } else {
      await apiClient.post('/api/authors', form);
    }
    setForm({ name: '', email: '', bio: '', avatar: '' });
    setEditing(null);
    load();
  };

  const handleEdit = (a: any) => { setEditing(a); setForm({ name: a.name, email: a.email, bio: a.bio || '', avatar: a.avatar || '' }); };
  const handleDelete = async (id: number) => { if (confirm('Delete?')) { await apiClient.delete(`/api/authors/${id}`); load(); } };

  return (
    <AppLayout isAdmin>
      <div className={styles.header}><div><h1>Authors</h1><p className={styles.subtitle}>Manage blog authors</p></div></div>
      <div className={styles.formCard}>
        <h3 style={{ marginBottom: 12 }}>{editing ? 'Edit Author' : 'New Author'}</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.field}><label>Name</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className={styles.field}><label>Email</label><input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className={`${styles.field} ${styles.full}`}><label>Bio</label><textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>
            <div className={`${styles.field} ${styles.full}`}><label>Avatar URL</label><input value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} /></div>
          </div>
          <div className={styles.btnRow}>
            <button type="submit" className={styles.primaryBtn}>{editing ? 'Update' : 'Create'}</button>
            {editing && <button type="button" className={styles.outlineBtn} onClick={() => { setEditing(null); setForm({ name: '', email: '', bio: '', avatar: '' }); }}><FiX size={14} /> Cancel</button>}
          </div>
        </form>
      </div>
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead><tr><th>Name</th><th>Email</th><th>Actions</th></tr></thead>
          <tbody>
            {authors.map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight: 600 }}>{a.name}</td>
                <td>{a.email}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleEdit(a)} style={{ color: '#1976D2' }}><FiEdit2 size={16} /></button>
                  <button onClick={() => handleDelete(a.id)} style={{ color: '#DC2626' }}><FiTrash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
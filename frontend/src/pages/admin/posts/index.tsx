import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import apiClient from '@/lib/api';
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from '@/styles/Admin.module.css';

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const load = () => apiClient.get('/api/posts?all=true').then(r => setPosts(r.data));
  useEffect(() => { load(); }, []);

  const filtered = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    await apiClient.delete(`/api/posts/${id}`);
    load();
  };

  return (
    <AppLayout isAdmin>
      <div className={styles.header}>
        <div><h1>Posts</h1><p className={styles.subtitle}>Manage all blog posts</p></div>
        <Link href="/admin/posts/new" className={styles.primaryBtn}><FiPlus size={16} /> New Post</Link>
      </div>
      <div className={styles.tableCard}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}><FiSearch size={16} color="#757575" /><input placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        </div>
        <table className={styles.table}>
          <thead><tr><th>Title</th><th>Category</th><th>Author</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.title}</td>
                <td>{p.category_name}</td>
                <td>{p.author_name}</td>
                <td><span className={`${styles.badge} ${p.is_published ? styles.badgeGreen : styles.badgeGray}`}>{p.is_published ? 'Published' : 'Draft'}</span></td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <Link href={`/admin/posts/edit/${p.id}`} style={{ color: '#1976D2' }}><FiEdit2 size={16} /></Link>
                  <button onClick={() => handleDelete(p.id)} style={{ color: '#DC2626' }}><FiTrash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
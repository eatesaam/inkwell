import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import apiClient from '@/lib/api';
import styles from '@/styles/admin.module.css';

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    setLoading(true);
    apiClient.get('/api/posts?all=true').then(r => setPosts(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    await apiClient.delete(`/api/posts/${id}`);
    fetchPosts();
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Posts</h1>
          <p className={styles.pageSub}>Manage all blog posts</p>
        </div>
        <Link href="/admin/posts/new" className={styles.primaryBtn}><FiPlus /> New Post</Link>
      </div>

      <div className={styles.tableCard}>
        {loading ? <p style={{ padding: 24, color: 'var(--color-secondary)' }}>Loading...</p> : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post: any) => (
                <tr key={post.id}>
                  <td><strong>{post.title}</strong></td>
                  <td>
                    <span className={`${styles.badge} ${post.is_published ? styles.badgePublished : styles.badgeDraft}`}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--color-secondary)' }}>
                    {post.created_at ? format(new Date(post.created_at), 'MMM d, yyyy') : ''}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/admin/posts/${post.id}`} className={styles.iconBtn}><FiEdit2 /></Link>
                      <button onClick={() => handleDelete(post.id)} className={styles.iconBtn}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--color-secondary)', padding: 32 }}>No posts yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
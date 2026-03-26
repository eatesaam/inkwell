import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import KpiCard from '@/components/dashboard/KpiCard';
import apiClient from '@/lib/api';
import { FiFileText, FiTag, FiUsers, FiPlus } from 'react-icons/fi';
import styles from '@/styles/Admin.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_posts: 0, total_categories: 0, total_authors: 0 });
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/api/admin/stats').then(r => setStats(r.data));
    apiClient.get('/api/posts?limit=5').then(r => setPosts(r.data));
  }, []);

  return (
    <AppLayout isAdmin>
      <div className={styles.header}>
        <div><h1>Dashboard</h1><p className={styles.subtitle}>Overview of your blog</p></div>
        <Link href="/admin/posts/new" className={styles.primaryBtn}><FiPlus size={16} /> New Post</Link>
      </div>
      <div className={styles.kpiGrid}>
        <KpiCard label="Total Posts" value={stats.total_posts} icon={<FiFileText size={22} />} color="#000" />
        <KpiCard label="Categories" value={stats.total_categories} icon={<FiTag size={22} />} color="#1976D2" />
        <KpiCard label="Authors" value={stats.total_authors} icon={<FiUsers size={22} />} color="#2E7D32" />
      </div>
      <div className={styles.tableCard}>
        <h2 className={styles.tableTitle}>Recent Posts</h2>
        <table className={styles.table}>
          <thead><tr><th>Title</th><th>Author</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id}>
                <td><Link href={`/admin/posts/edit/${p.id}`} className={styles.link}>{p.title}</Link></td>
                <td>{p.author_name}</td>
                <td><span className={`${styles.badge} ${p.is_published ? styles.badgeGreen : styles.badgeGray}`}>{p.is_published ? 'Published' : 'Draft'}</span></td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
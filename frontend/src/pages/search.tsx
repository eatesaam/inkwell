import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiSearch } from 'react-icons/fi';
import apiClient from '@/lib/api';
import styles from '@/styles/home.module.css';

export default function SearchPage() {
  const router = useRouter();
  const q = (router.query.q as string) || '';
  const [search, setSearch] = useState(q);
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setSearch(q); }, [q]);

  useEffect(() => {
    apiClient.get('/api/categories').then(r => setCategories(r.data));
  }, []);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    apiClient.get(`/api/search?q=${encodeURIComponent(q)}`).then(r => setPosts(r.data)).finally(() => setLoading(false));
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-brand)', fontSize: 28, marginBottom: 20 }}>Search</h1>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..." style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: 14, outline: 'none' }} />
        <button type="submit" style={{ padding: '10px 20px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}><FiSearch /> Search</button>
      </form>
      {loading ? <p>Searching...</p> : (
        <div className={styles.layout}>
          <div className={styles.mainCol}>
            {q && <p style={{ fontSize: 13, color: 'var(--color-secondary)', marginBottom: 16 }}>{posts.length} result{posts.length !== 1 ? 's' : ''} for &quot;{q}&quot;</p>}
            <div className={styles.postGrid}>
              {posts.map((post: any) => (
                <Link href={`/posts/${post.slug}`} key={post.id} className={styles.postCard}>
                  {post.featured_image && <img src={post.featured_image} alt={post.title} className={styles.postImg} />}
                  <div className={styles.postBody}>
                    <div className={styles.meta}>
                      <span>{post.author_name}</span>
                      <span className={styles.dot}>·</span>
                      <span>{post.published_at ? format(new Date(post.published_at), 'MMM d') : ''}</span>
                    </div>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <p className={styles.excerptSm}>{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <aside className={styles.sideCol}>
            <h4 className={styles.sideTitle}>Categories</h4>
            {categories.map((c: any) => (
              <Link href={`/category/${c.slug}`} key={c.id} className={styles.catLink}>{c.name}</Link>
            ))}
          </aside>
        </div>
      )}
    </div>
  );
}
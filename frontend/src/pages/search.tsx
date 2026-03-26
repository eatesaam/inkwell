import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import apiClient from '@/lib/api';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import styles from '@/styles/Home.module.css';
import s from '@/styles/Search.module.css';

export default function SearchPage() {
  const router = useRouter();
  const q = (router.query.q as string) || '';
  const [query, setQuery] = useState(q);
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setQuery(q); }, [q]);
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
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <AppLayout>
      <div className={styles.page}>
        <div className={styles.mainCol}>
          <form onSubmit={handleSearch} className={s.searchForm}>
            <FiSearch size={18} className={s.searchIcon} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search posts..." className={s.searchInput} />
          </form>
          {q && <p style={{ color: '#757575', margin: '16px 0' }}>Results for "{q}" ({posts.length})</p>}
          {loading ? <p>Searching...</p> : (
            <div className={styles.grid}>
              {posts.map(post => (
                <Link key={post.id} href={`/posts/${post.slug}`} className={styles.card}>
                  <div className={styles.cardImg}><img src={post.featured_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop'} alt={post.title} /></div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardCat}>{post.category_name}</span>
                    <h3 className={styles.cardTitle}>{post.title}</h3>
                    <p className={styles.cardExcerpt}>{post.excerpt}</p>
                    <div className={styles.cardMeta}><span>{post.author_name}</span><FiArrowRight size={14} /></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <h3 className={styles.sideTitle}>Categories</h3>
            {categories.map(c => (
              <Link key={c.id} href={`/category/${c.slug}`} className={styles.catLink}>{c.name}</Link>
            ))}
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
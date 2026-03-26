import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import apiClient from '@/lib/api';
import { FiArrowRight } from 'react-icons/fi';
import styles from '@/styles/Home.module.css';

export default function CategoryPosts() {
  const router = useRouter();
  const { slug } = router.query;
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      apiClient.get(`/api/categories/${slug}/posts`),
      apiClient.get('/api/categories'),
    ]).then(([p, c]) => { setPosts(p.data); setCategories(c.data); }).finally(() => setLoading(false));
  }, [slug]);

  const current = categories.find(c => c.slug === slug);

  return (
    <AppLayout>
      <div className={styles.page}>
        <div className={styles.mainCol}>
          <h1 style={{ fontSize: 24, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>{current?.name || slug}</h1>
          {current?.description && <p style={{ color: '#757575', marginBottom: 24 }}>{current.description}</p>}
          {loading ? <p>Loading...</p> : posts.length === 0 ? <p style={{ color: '#757575' }}>No posts in this category yet.</p> : (
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
              <Link key={c.id} href={`/category/${c.slug}`} className={styles.catLink} style={c.slug === slug ? { color: '#000', fontWeight: 600 } : {}}>{c.name}</Link>
            ))}
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
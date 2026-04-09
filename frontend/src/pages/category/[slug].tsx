import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiArrowLeft } from 'react-icons/fi';
import apiClient from '@/lib/api';
import styles from '@/styles/home.module.css';

export default function CategoryPosts() {
  const router = useRouter();
  const { slug } = router.query;
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      apiClient.get(`/api/posts?category=${slug}`),
      apiClient.get('/api/categories'),
    ]).then(([p, c]) => {
      setPosts(p.data);
      setCategories(c.data);
    }).finally(() => setLoading(false));
  }, [slug]);

  const catName = categories.find(c => c.slug === slug)?.name || slug;

  return (
    <div>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-secondary)', marginBottom: 16 }}><FiArrowLeft /> Back</Link>
      <h1 style={{ fontFamily: 'var(--font-brand)', fontSize: 28, textTransform: 'uppercase', marginBottom: 24 }}>{catName}</h1>
      {loading ? <p>Loading...</p> : (
        <div className={styles.layout}>
          <div className={styles.mainCol}>
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
              {posts.length === 0 && <p style={{ color: 'var(--color-secondary)' }}>No posts in this category.</p>}
            </div>
          </div>
          <aside className={styles.sideCol}>
            <h4 className={styles.sideTitle}>Categories</h4>
            {categories.map((c: any) => (
              <Link href={`/category/${c.slug}`} key={c.id} className={styles.catLink} style={c.slug === slug ? { fontWeight: 700 } : {}}>{c.name}</Link>
            ))}
          </aside>
        </div>
      )}
    </div>
  );
}
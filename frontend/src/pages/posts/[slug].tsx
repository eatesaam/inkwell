import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import apiClient from '@/lib/api';
import { FiArrowLeft, FiClock, FiUser } from 'react-icons/fi';
import styles from '@/styles/PostDetail.module.css';

export default function PostDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;
    apiClient.get(`/api/posts/${slug}`).then(r => setPost(r.data)).catch(() => {});
    apiClient.get('/api/categories').then(r => setCategories(r.data));
  }, [slug]);

  if (!post) return <AppLayout><p style={{ padding: 32 }}>Loading...</p></AppLayout>;

  return (
    <AppLayout>
      <div className={styles.page}>
        <div className={styles.mainCol}>
          <Link href="/" className={styles.back}><FiArrowLeft size={14} /> Back to posts</Link>
          {post.featured_image && (
            <div className={styles.heroImg}>
              <img src={post.featured_image} alt={post.title} />
            </div>
          )}
          <div className={styles.meta}>
            <span className={styles.badge}>{post.category_name}</span>
            <span><FiClock size={12} /> {new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.authorRow}>
            <div className={styles.avatar}><FiUser size={16} /></div>
            <div>
              <Link href={`/authors/${post.author_id}`} className={styles.authorName}>{post.author_name}</Link>
            </div>
          </div>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />
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
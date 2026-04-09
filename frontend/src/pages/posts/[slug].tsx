import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiArrowLeft } from 'react-icons/fi';
import apiClient from '@/lib/api';
import styles from '@/styles/post.module.css';

export default function PostDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      apiClient.get(`/api/posts/${slug}`),
      apiClient.get('/api/categories'),
    ]).then(([p, c]) => {
      setPost(p.data);
      setCategories(c.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p style={{ padding: 40, textAlign: 'center', color: 'var(--color-secondary)' }}>Loading...</p>;
  if (!post) return <p style={{ padding: 40, textAlign: 'center' }}>Post not found.</p>;

  return (
    <div>
      <Link href="/" className={styles.back}><FiArrowLeft /> Back</Link>
      <div className={styles.layout}>
        <article className={styles.article}>
          {post.featured_image && <img src={post.featured_image} alt={post.title} className={styles.heroImg} />}
          <div className={styles.meta}>
            {post.author_avatar && <img src={post.author_avatar} className={styles.avatar} alt="" />}
            <div>
              <Link href={`/author/${post.author_id}`} className={styles.authorLink}>{post.author_name}</Link>
              <span className={styles.date}>{post.published_at ? format(new Date(post.published_at), 'MMMM d, yyyy') : ''}</span>
            </div>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
        <aside className={styles.side}>
          <h4 className={styles.sideTitle}>Categories</h4>
          {categories.map((c: any) => (
            <Link href={`/category/${c.slug}`} key={c.id} className={styles.catLink}>{c.name}</Link>
          ))}
        </aside>
      </div>
    </div>
  );
}
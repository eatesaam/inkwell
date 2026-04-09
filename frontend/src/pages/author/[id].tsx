import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiArrowLeft } from 'react-icons/fi';
import apiClient from '@/lib/api';
import styles from '@/styles/home.module.css';

export default function AuthorProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [author, setAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    apiClient.get(`/api/authors/${id}`).then(r => setAuthor(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ padding: 40, textAlign: 'center', color: 'var(--color-secondary)' }}>Loading...</p>;
  if (!author) return <p style={{ padding: 40 }}>Author not found.</p>;

  return (
    <div>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-secondary)', marginBottom: 24 }}><FiArrowLeft /> Back</Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
        {author.avatar && <img src={author.avatar} alt={author.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />}
        <div>
          <h1 style={{ fontFamily: 'var(--font-brand)', fontSize: 28 }}>{author.name}</h1>
          {author.bio && <p style={{ color: 'var(--color-secondary)', fontSize: 14, marginTop: 4 }}>{author.bio}</p>}
        </div>
      </div>
      <h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--color-secondary)', marginBottom: 16, fontWeight: 600 }}>Posts by {author.name}</h3>
      <div className={styles.postGrid}>
        {(author.posts || []).map((post: any) => (
          <Link href={`/posts/${post.slug}`} key={post.id} className={styles.postCard}>
            {post.featured_image && <img src={post.featured_image} alt={post.title} className={styles.postImg} />}
            <div className={styles.postBody}>
              <div className={styles.meta}>
                <span>{post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : ''}</span>
              </div>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.excerptSm}>{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import apiClient from '@/lib/api';
import { FiArrowLeft, FiArrowRight, FiUser, FiMail } from 'react-icons/fi';
import styles from '@/styles/Author.module.css';

export default function AuthorProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [author, setAuthor] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    apiClient.get(`/api/authors/${id}`).then(r => setAuthor(r.data));
  }, [id]);

  if (!author) return <AppLayout><p style={{ padding: 32 }}>Loading...</p></AppLayout>;

  return (
    <AppLayout>
      <Link href="/" className={styles.back}><FiArrowLeft size={14} /> Back</Link>
      <div className={styles.header}>
        <div className={styles.avatar}><FiUser size={32} /></div>
        <div>
          <h1 className={styles.name}>{author.name}</h1>
          <p className={styles.email}><FiMail size={12} /> {author.email}</p>
          {author.bio && <p className={styles.bio}>{author.bio}</p>}
        </div>
      </div>
      <h2 className={styles.sectionTitle}>Posts by {author.name}</h2>
      <div className={styles.grid}>
        {(author.posts || []).map((post: any) => (
          <Link key={post.id} href={`/posts/${post.slug}`} className={styles.card}>
            {post.featured_image && <img src={post.featured_image} alt={post.title} className={styles.cardImg} />}
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{post.title}</h3>
              <p className={styles.cardExcerpt}>{post.excerpt}</p>
              <FiArrowRight size={14} style={{ color: '#757575', marginTop: 8 }} />
            </div>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
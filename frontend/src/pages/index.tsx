import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiSearch } from 'react-icons/fi';
import apiClient from '@/lib/api';
import styles from '@/styles/home.module.css';

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/api/posts'),
      apiClient.get('/api/categories'),
    ]).then(([p, c]) => {
      setPosts(p.data);
      setCategories(c.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) window.location.href = `/search?q=${encodeURIComponent(search)}`;
  };

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.heroTitle}>Inkwell</h1>
        <p className={styles.heroSub}>Stories worth reading</p>
      </div>

      <div className={styles.utilityBar}>
        <span className={styles.allPosts}>All Posts</span>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className={styles.searchInput} />
          <button type="submit" className={styles.searchBtn}><FiSearch /></button>
        </form>
      </div>

      {loading ? <p style={{ textAlign: 'center', padding: 40, color: 'var(--color-secondary)' }}>Loading...</p> : (
        <div className={styles.layout}>
          <div className={styles.mainCol}>
            {featured && (
              <Link href={`/posts/${featured.slug}`} className={styles.featuredCard}>
                {featured.featured_image && (
                  <img src={featured.featured_image} alt={featured.title} className={styles.featuredImg} />
                )}
                <div className={styles.featuredBody}>
                  <div className={styles.meta}>
                    {featured.author_avatar && <img src={featured.author_avatar} className={styles.avatar} alt="" />}
                    <span>{featured.author_name}</span>
                    <span className={styles.dot}>·</span>
                    <span>{featured.published_at ? format(new Date(featured.published_at), 'MMM d, yyyy') : ''}</span>
                  </div>
                  <h2 className={styles.featuredTitle}>{featured.title}</h2>
                  <p className={styles.excerpt}>{featured.excerpt}</p>
                </div>
              </Link>
            )}

            <div className={styles.postGrid}>
              {rest.map((post: any) => (
                <Link href={`/posts/${post.slug}`} key={post.id} className={styles.postCard}>
                  {post.featured_image && (
                    <img src={post.featured_image} alt={post.title} className={styles.postImg} />
                  )}
                  <div className={styles.postBody}>
                    <div className={styles.meta}>
                      {post.author_avatar && <img src={post.author_avatar} className={styles.avatarSm} alt="" />}
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
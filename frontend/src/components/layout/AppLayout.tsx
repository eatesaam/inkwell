import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiGrid, FiSearch, FiSettings, FiMenu, FiX, FiFileText, FiTag, FiUsers } from 'react-icons/fi';
import styles from './AppLayout.module.css';

const publicNav = [
  { label: 'Home', href: '/', icon: FiHome },
  { label: 'Categories', href: '/category/fashion', icon: FiGrid },
  { label: 'Search', href: '/search', icon: FiSearch },
];
const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: FiSettings },
  { label: 'Posts', href: '/admin/posts', icon: FiFileText },
  { label: 'Categories', href: '/admin/categories', icon: FiTag },
  { label: 'Authors', href: '/admin/authors', icon: FiUsers },
];

export default function AppLayout({ children, isAdmin }: { children: React.ReactNode; isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const nav = isAdmin ? adminNav : publicNav;

  return (
    <div className={styles.shell}>
      <div className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.brandLink}>
            <span className={styles.brandName}>Inkwell</span>
          </Link>
          <button className={styles.closeBtn} onClick={() => setOpen(false)}><FiX size={20} /></button>
        </div>
        <nav className={styles.nav}>
          {nav.map(n => (
            <Link key={n.href} href={n.href} className={`${styles.navItem} ${router.pathname === n.href || (n.href !== '/' && router.pathname.startsWith(n.href)) ? styles.active : ''}`}>
              <n.icon size={18} /><span>{n.label}</span>
            </Link>
          ))}
        </nav>
        {!isAdmin && (
          <div className={styles.navSection}>
            <div className={styles.navSectionLabel}>Admin</div>
            {adminNav.map(n => (
              <Link key={n.href} href={n.href} className={`${styles.navItem} ${router.pathname.startsWith(n.href) ? styles.active : ''}`}>
                <n.icon size={18} /><span>{n.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} />}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setOpen(true)}><FiMenu size={20} /></button>
          <Link href="/" className={styles.topBrand}>Inkwell</Link>
          <div className={styles.topRight}>
            <Link href="/search" className={styles.topIcon}><FiSearch size={18} /></Link>
          </div>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
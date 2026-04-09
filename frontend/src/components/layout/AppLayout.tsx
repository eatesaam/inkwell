import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiGrid, FiSearch, FiSettings, FiMenu, FiX } from 'react-icons/fi';
import styles from '@/styles/layout.module.css';

const navItems = [
  { label: 'Home', href: '/', icon: FiHome },
  { label: 'Categories', href: '/category/fashion', icon: FiGrid },
  { label: 'Search', href: '/search', icon: FiSearch },
  { label: 'Admin', href: '/admin/posts', icon: FiSettings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className={styles.appShell}>
      <div className={open ? styles.backdropVisible : styles.backdrop} onClick={() => setOpen(false)} />
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          <Link href="/"><span className={styles.brandName}>Inkwell</span></Link>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const active = router.pathname === item.href || (item.href !== '/' && router.asPath.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={`${styles.navItem} ${active ? styles.navItemActive : ''}`} onClick={() => setOpen(false)}>
                <item.icon className={styles.navIcon} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className={styles.main}>
        <div className={styles.topBar}>
          <button className={styles.menuBtn} onClick={() => setOpen(!open)}>
            {open ? <FiX /> : <FiMenu />}
          </button>
          <span className={styles.brandName} style={{ fontSize: 20 }}>Inkwell</span>
          <div style={{ width: 22 }} />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
import React from 'react';
import styles from './KpiCard.module.css';

export default function KpiCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className={styles.card}>
      <div>
        <div className={styles.label}>{label}</div>
        <div className={styles.value}>{value}</div>
      </div>
      <div className={styles.iconWrap} style={{ background: color + '15', color }}>{icon}</div>
    </div>
  );
}
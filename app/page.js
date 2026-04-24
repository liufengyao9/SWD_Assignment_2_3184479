import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.card}>
        <div>
          <h1 className={styles.title}>Household Appliance Inventory</h1>
          <p className={styles.subtitle}>Choose an action to manage appliance records.</p>
        </div>

        <div className={styles.grid}>
          <Link href="/part-b-c/add" className={styles.linkCard}>
            <h2>Add Appliance</h2>
          </Link>
          <Link href="/part-b-c/search" className={styles.linkCard}>
            <h2>Search Appliance</h2>
          </Link>
          <Link href="/part-b-c/update" className={styles.linkCard}>
            <h2>Update Appliance</h2>
          </Link>
          <Link href="/part-b-c/delete" className={styles.linkCard}>
            <h2>Delete Appliance</h2>
          </Link>
        </div>
      </div>
    </div>
  );
}

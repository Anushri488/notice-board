import Link from "next/link";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark}>NB</span>
            <span>Notice Board</span>
          </Link>
          <Link href="/notices/new" className={styles.newButton}>
            + New notice
          </Link>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

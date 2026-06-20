import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../components/Layout";
import NoticeCard from "../components/NoticeCard";
import ConfirmDialog from "../components/ConfirmDialog";
import prisma from "../lib/prisma";
import styles from "../styles/Index.module.css";

export async function getServerSideProps() {
  // Urgent-first ordering is done here, in the Prisma query — not by
  // sorting an array in the browser.
  const notices = await prisma.notice.findMany({
    orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
  });

  return {
    props: {
      notices: notices.map((n) => ({
      ...n,
      publishDate: n.publishDate.toISOString(),
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
      })),
    },
  };
}

export default function Home({ notices }) {
  const router = useRouter();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/notices/${pendingDelete.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete notice.");
      }
      setPendingDelete(null);
      router.replace(router.asPath); // re-run getServerSideProps
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Layout>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Notices</h1>
          <p className={styles.subtitle}>
            {notices.length} {notices.length === 1 ? "notice" : "notices"} · Urgent items always appear first
          </p>
        </div>
      </div>

      {notices.length === 0 ? (
        <div className={styles.empty}>
          <p>No notices yet.</p>
          <p className={styles.emptyHint}>Use “+ New notice” above to post the first one.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} onDeleteRequest={setPendingDelete} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this notice?"
        message={
          pendingDelete
            ? `“${pendingDelete.title}” will be permanently removed. This can't be undone.`
            : ""
        }
        confirmLabel={deleting ? "Deleting…" : "Delete"}
        onConfirm={confirmDelete}
        onCancel={() => {
          if (!deleting) {
            setPendingDelete(null);
            setDeleteError("");
          }
        }}
      />
      {deleteError && <p className={styles.deleteError}>{deleteError}</p>}
    </Layout>
  );
}

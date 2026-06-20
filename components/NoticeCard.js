import Link from "next/link";
import styles from "./NoticeCard.module.css";

const CATEGORY_CLASS = {
  Exam: styles.tagExam,
  Event: styles.tagEvent,
  General: styles.tagGeneral,
};

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function NoticeCard({ notice, onDeleteRequest }) {
  const isUrgent = notice.priority === "Urgent";

  return (
    <article className={`${styles.card} ${isUrgent ? styles.cardUrgent : ""}`}>
      {isUrgent && <span className={styles.urgentRibbon}>Urgent</span>}

      <div className={styles.cardBody}>
        <div className={styles.metaRow}>
          <span className={`${styles.tag} ${CATEGORY_CLASS[notice.category] ?? styles.tagGeneral}`}>
            {notice.category}
          </span>
          <span className={styles.date}>{formatDate(notice.publishDate)}</span>
        </div>

        <h3 className={styles.title}>{notice.title}</h3>
        <p className={styles.snippet}>{notice.body}</p>
      </div>

      <div className={styles.actions}>
        <Link href={`/notices/${notice.id}/edit`} className={styles.editButton}>
          Edit
        </Link>
        <button
          type="button"
          className={styles.deleteButton}
          onClick={() => onDeleteRequest(notice)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

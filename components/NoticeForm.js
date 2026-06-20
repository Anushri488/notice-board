import { useState } from "react";
import styles from "./NoticeForm.module.css";

const CATEGORIES = ["Exam", "Event", "General"];
const PRIORITIES = ["Normal", "Urgent"];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function toDateInputValue(value) {
  if (!value) return todayIso();
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return todayIso();
  return d.toISOString().slice(0, 10);
}

export default function NoticeForm({ initialValues, submitLabel, onSubmit, submitting, serverErrors }) {
  const [values, setValues] = useState({
    title: initialValues?.title ?? "",
    body: initialValues?.body ?? "",
    category: initialValues?.category ?? "General",
    priority: initialValues?.priority ?? "Normal",
    publishDate: toDateInputValue(initialValues?.publishDate),
  });
  const [clientErrors, setClientErrors] = useState({});

  const errors = { ...clientErrors, ...serverErrors };

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function validateClientSide() {
    const next = {};
    if (!values.title.trim()) next.title = "Title is required.";
    if (!values.body.trim()) next.body = "Body is required.";
    if (!values.publishDate) next.publishDate = "Publish date is required.";
    setClientErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateClientSide()) return;
    onSubmit(values);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="title" className={styles.label}>
          Title
        </label>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          className={styles.input}
          maxLength={200}
        />
        {errors.title && <p className={styles.error}>{errors.title}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="body" className={styles.label}>
          Body
        </label>
        <textarea
          id="body"
          value={values.body}
          onChange={(e) => update("body", e.target.value)}
          className={styles.textarea}
          rows={6}
        />
        {errors.body && <p className={styles.error}>{errors.body}</p>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="category" className={styles.label}>
            Category
          </label>
          <select
            id="category"
            value={values.category}
            onChange={(e) => update("category", e.target.value)}
            className={styles.select}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <p className={styles.error}>{errors.category}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Priority</label>
          <div className={styles.priorityToggle}>
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                className={`${styles.priorityOption} ${
                  values.priority === p ? styles.priorityOptionActive : ""
                } ${p === "Urgent" ? styles.priorityOptionUrgent : ""}`}
                onClick={() => update("priority", p)}
                aria-pressed={values.priority === p}
              >
                {p}
              </button>
            ))}
          </div>
          {errors.priority && <p className={styles.error}>{errors.priority}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="publishDate" className={styles.label}>
            Publish date
          </label>
          <input
            id="publishDate"
            type="date"
            value={values.publishDate}
            onChange={(e) => update("publishDate", e.target.value)}
            className={styles.input}
          />
          {errors.publishDate && <p className={styles.error}>{errors.publishDate}</p>}
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton} disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

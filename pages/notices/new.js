import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../../components/Layout";
import NoticeForm from "../../components/NoticeForm";
import styles from "../../styles/FormPage.module.css";

export default function NewNotice() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  async function handleSubmit(values) {
    setSubmitting(true);
    setServerErrors({});
    setGeneralError("");
    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerErrors(data.fields || {});
        setGeneralError(data.fields ? "" : data.error || "Something went wrong.");
        return;
      }
      router.push("/");
    } catch (err) {
      setGeneralError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <h1 className={styles.title}>New notice</h1>
      {generalError && <p className={styles.generalError}>{generalError}</p>}
      <NoticeForm
        submitLabel="Publish notice"
        submitting={submitting}
        serverErrors={serverErrors}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
}

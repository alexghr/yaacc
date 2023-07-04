"use client";

import search from "@/api/search";
import styles from "./page.module.css";
import Textarea from "@/components/Textarea";
import { useId } from "react";

export default function Home() {
  const textAreaId = useId();
  return (
    <main className={styles.main}>
      <label className={styles.label} htmlFor={textAreaId}>
        Comment:
      </label>
      <Textarea inputId={textAreaId} search={search} />
      <small className={styles.small}>
        Use <span className={styles.mono}>@</span> to mention other users
      </small>
    </main>
  );
}

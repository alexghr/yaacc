"use client";

import search from "@/api/search";
import styles from "./page.module.css";
import Textarea from "@/components/Textarea";

export default function Home() {
  return (
    <main className={styles.main}>
      <Textarea search={search} />
    </main>
  );
}

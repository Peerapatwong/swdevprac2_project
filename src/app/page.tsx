import styles from "./page.module.css"
import Banner from "@/components/Banner";
import PromoteCard from "@/components/PromoteCard";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Banner/>
        <PromoteCard/>
      </main>
    </div>
  );
}

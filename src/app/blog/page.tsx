import Link from "next/link";
import connectDB from "../../database/db";
import blogSchema from "../../database/blogSchema";
import styles from "./blog.module.css";

async function getBlogs() {
  try {
    await connectDB();
    const blogs = await blogSchema.find().sort({ date: -1 });
    return blogs ?? [];
  } catch (err) {
    console.error("Blog DB error:", err);
    return [];
  }
}

export default async function Blog() {
  const posts = await getBlogs();

  return (
    <div className={styles.page}>
      <div className={styles.topBackLinkWrapper}>
        <Link href="/?go=game" className={styles.backLink}>
          ← Back to the Sea
        </Link>
      </div>

      <div className={styles.gridOverlay} />

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Blog</h1>
          <div className={styles.divider}>
            <div className={styles.dividerLineLeft} />
            <div className={styles.dividerStar}>✦</div>
            <div className={styles.dividerLineRight} />
          </div>
          <p className={styles.entryCount}>
            {posts.length} {posts.length === 1 ? "entry" : "entries"} in the log
          </p>
        </div>

        {posts.length === 0 ? (
          <div className={styles.emptyState}>No posts found.</div>
        ) : (
          <div className={styles.list}>
            {posts.map((post, idx) => (
              <Link
                key={String(post._id)}
                href={`/blog/${post.slug}`}
                className={styles.card}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={styles.cardRow}>
                  <div className={styles.cardTextWrap}>
                    <h2 className={styles.cardTitle}>{post.title}</h2>
                    {post.date && (
                      <p className={styles.cardDate}>{post.date}</p>
                    )}
                    {post.description && (
                      <p className={styles.cardDescription}>
                        {post.description}
                      </p>
                    )}
                  </div>
                  <span className={styles.cardArrow}>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <Link href="/?go=game" className={styles.footerBack}>
            ← Back to the Sea
          </Link>
        </div>
      </div>
    </div>
  );
}

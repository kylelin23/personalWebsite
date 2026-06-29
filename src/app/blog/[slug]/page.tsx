import Link from "next/link";
import BlogPreview from "../../../components/blogPreview/blogPreview";
import styles from "./blogPost.module.css";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getBlog(slug: string) {
  try {
    const baseURL = process.env.NEXT_PUBLIC_PROD_URL!;
    const res = await fetch(`${baseURL}/api/blog/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch blog");
    return res.json();
  } catch (err: unknown) {
    console.log(`error: ${err}`);
    return null;
  }
}

export default async function Blog(props: Props) {
  const { slug } = await props.params;
  const blog = await getBlog(slug);

  return (
    <div className={styles.page}>
      <div className={styles.topBackLinkWrapper}>
        <Link href="/blog" className={styles.backLink}>
          ← Back to Blog
        </Link>
      </div>

      <div className={styles.gridOverlay} />

      <div className={styles.content}>
        {!blog ? (
          <div className={styles.notFound}>
            <h2 className={styles.notFoundTitle}>Post Not Found</h2>
            <p className={styles.notFoundText}>
              This entry has been lost to the sea.
            </p>
            <Link href="/blog" className={styles.backLink}>
              ← Back to Blog
            </Link>
          </div>
        ) : (
          <div className={styles.postWrapper}>
            <div className={styles.header}>
              <h1 className={styles.title}>{blog.title}</h1>
              {blog.date && <p className={styles.date}>{blog.date}</p>}
              <div className={styles.divider}>
                <div className={styles.dividerLineLeft} />
                <div className={styles.dividerStar}>✦</div>
                <div className={styles.dividerLineRight} />
              </div>
            </div>

            <div className={styles.previewCard}>
              <BlogPreview
                key={blog.slug}
                title={blog.title}
                date={blog.date}
                description={blog.description}
                image={blog.image}
                imageAlt={blog.imageAlt}
                comments={blog.comments}
                slug={blog.slug}
              />
            </div>

            <div className={styles.footer}>
              <Link href="/blog" className={styles.footerBack}>
                ← Back to Blog
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

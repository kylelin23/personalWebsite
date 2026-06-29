import Link from "next/link";
import projectSchema from "../../database/projectSchema";
import connectDB from "../../database/db";
import styles from "./portfolio.module.css";

async function getProjects() {
  try {
    await connectDB();
    const projects = await projectSchema.find().sort({ key: 1 });
    return projects;
  } catch (err) {
    console.error("FULL ERROR:", err);
    return [];
  }
}

export default async function Portfolio() {
  const projects = (await getProjects()) ?? [];

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
          <h1 className={styles.title}>Portfolio</h1>
          <div className={styles.divider}>
            <div className={styles.dividerLineLeft} />
            <div className={styles.dividerStar}>✦</div>
            <div className={styles.dividerLineRight} />
          </div>
        </div>

        {projects.length === 0 ? (
          <div className={styles.emptyState}>No projects found.</div>
        ) : (
          <div className={styles.list}>
            {projects.map((project, idx) => (
              <div
                key={project.key ?? idx}
                className={styles.card}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {project.image && (
                  <div className={styles.cardImage}>
                    {project.imageLink ? (
                      <a
                        href={project.imageLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={project.image}
                          alt={project.imageAlt ?? project.title}
                          width={project.imageWidth ?? 180}
                          className={styles.cardImageImg}
                        />
                      </a>
                    ) : (
                      <img
                        src={project.image}
                        alt={project.imageAlt ?? project.title}
                        width={project.imageWidth ?? 180}
                        className={styles.cardImageImg}
                      />
                    )}
                  </div>
                )}

                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>
                    {project.imageLink ? (
                      <a
                        href={project.imageLink}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.cardTitleLink}
                      >
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                  </h2>

                  {project.tech && (
                    <div className={styles.techBadgeRow}>
                      {(Array.isArray(project.tech)
                        ? project.tech
                        : String(project.tech).split(",")
                      ).map((t: string) => (
                        <span key={t.trim()} className={styles.techBadge}>
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className={styles.description}>{project.description}</p>

                  {project.imageLink && (
                    <a
                      href={project.imageLink}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.projLink}
                    >
                      View Project →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <Link href="/?go=game" className={styles.backLink}>
            ← Back to the Sea
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import Skill from "../../components/skill/skill";
import {
  programmingLanguages,
  developerTools,
  frameworks,
  certifications,
} from "../resumeData";
import styles from "./resume.module.css";

export default function Resume() {
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
          <h1 className={styles.title}>Resume</h1>
          <div className={styles.divider}>
            <div className={styles.dividerLineLeft} />
            <div className={styles.dividerStar}>✦</div>
            <div className={styles.dividerLineRight} />
          </div>
          <Link href="assets/resume.pdf" className={styles.downloadBtn}>
            Download Resume
          </Link>
        </div>

        <div className={`${styles.resumeCard} ${styles.eduCard}`}>
          <p className={styles.sectionTitle}>Education</p>

          <div className={styles.schoolCard}>
            <img
              src="assets/logos/calPolyLogo.jpg"
              alt="Cal Poly Logo"
              width={120}
              className={styles.schoolLogo}
            />
            <div>
              <p className={styles.schoolName}>
                California Polytechnic State University, San Luis Obispo
              </p>
              <p className={styles.schoolDetail}>
                <strong>Degree: </strong>Bachelor of Science, Computer Science
              </p>
              <p className={styles.schoolDetail}>
                <strong>Expected Graduation: </strong>May 2027
              </p>
              <p className={styles.schoolDetail}>
                <strong>Coursework: </strong>Data Structures and Algorithms,
                Databases, Full-Stack Development, Artificial Intelligence, Data
                Science, Object-Oriented Programming, Programming Languages
              </p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Experience</p>
          <div className={styles.cardList}>
            <div className={styles.portfolioCard}>
              <div className={styles.cardImage}>
                <a
                  href="https://prfc-connect.vercel.app/dev/mock-portal"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/assets/logos/hack4ImpactScreenshot.png"
                    alt="Hack4Impact Paso Food Co-op project screenshot"
                    className={styles.cardImageImg}
                  />
                </a>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.entryTop}>
                  <h2 className={styles.entryTitle}>
                    <a
                      href="https://prfc-connect.vercel.app/dev/mock-portal"
                      target="_blank"
                      rel="noreferrer"
                      className={styles.titleLink}
                    >
                      Full Stack Developer for Paso Food Co-op
                    </a>
                  </h2>
                  <p className={styles.entryDate}>September 2025 – June 2026</p>
                </div>
                <div
                  className={`${styles.entrySub} ${styles.entrySubExperience}`}
                >
                  <p className={styles.entryOrg}>
                    Hack4Impact at California Polytechnic State University
                  </p>
                </div>
                <div className={styles.techBadgeRow}>
                  {["Node.js", "React", "MongoDB"].map((t) => (
                    <span key={t} className={styles.techBadge}>
                      {t}
                    </span>
                  ))}
                </div>
                <ul className={styles.entryBullets}>
                  <li>
                    - Developed a full stack website for a 400-member food co-op
                    using Node.js, React, and MongoDB in a team of 12
                  </li>
                  <li>
                    - Participated in Agile development, including code reviews
                    and sprint planning
                  </li>
                  <li>
                    - Implemented CRUD operations and RESTful APIs to support
                    authentication, real-time messaging, and event scheduling
                  </li>
                </ul>
                <a
                  href="https://prfc-connect.vercel.app/dev/mock-portal"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.projLink}
                >
                  View Project →
                </a>
              </div>
            </div>

            <div className={styles.portfolioCard}>
              <div className={styles.cardImage}>
                <a
                  href="https://ehs-learning-library-pb25.onrender.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/assets/EHSProjectScreenshot.png"
                    alt="Neighborhood House Association educator resource website screenshot"
                    className={styles.cardImageImg}
                  />
                </a>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.entryTop}>
                  <h2 className={styles.entryTitle}>
                    <a
                      href="https://ehs-learning-library-pb25.onrender.com/"
                      target="_blank"
                      rel="noreferrer"
                      className={styles.titleLink}
                    >
                      Frontend Developer Intern
                    </a>
                  </h2>
                  <p className={styles.entryDate}>July 2025 – September 2025</p>
                </div>
                <div
                  className={`${styles.entrySub} ${styles.entrySubExperience}`}
                >
                  <p className={styles.entryOrg}>
                    Neighborhood House Association
                  </p>
                  <p className={styles.entryLoc}>Remote</p>
                </div>
                <div className={styles.techBadgeRow}>
                  {["React"].map((t) => (
                    <span key={t} className={styles.techBadge}>
                      {t}
                    </span>
                  ))}
                </div>
                <ul className={styles.entryBullets}>
                  <li>
                    - Led a team of 4 engineers as a project lead to develop a
                    website used by real educators, consolidating resources from
                    6+ external sources into a single searchable website
                  </li>
                  <li>
                    - Built dynamic features such as search and filtering in
                    React, greatly reducing the time required for educators to
                    locate relevant educational resources
                  </li>
                  <li>
                    - Planned weekly sprints and code reviews, mentored a junior
                    developer in React, and improved team development workflow
                    and collaboration by leading weekly team meetings
                  </li>
                </ul>
                <a
                  href="https://ehs-learning-library-pb25.onrender.com/"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.projLink}
                >
                  View Project →
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Projects</p>
          <div className={styles.cardList}>
            <div className={styles.portfolioCard}>
              <div className={styles.cardImage}>
                <a
                  href="https://github.com/kylelin23/catAdoptionApp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/assets/catAdoptionAppScreenshot.png"
                    alt="CatWise app screenshot"
                    className={styles.cardImageImg}
                  />
                </a>
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.projectTitle}>
                  <a
                    href="https://github.com/kylelin23/catAdoptionApp"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.titleLink}
                  >
                    CatWise
                  </a>
                </h2>
                <div className={`${styles.entrySub} ${styles.entrySubProject}`}>
                  <p className={styles.entryOrg}>
                    iOS Mobile Application | React Native
                  </p>
                </div>
                <div className={styles.techBadgeRow}>
                  {["React Native", "Supabase"].map((t) => (
                    <span key={t} className={styles.techBadge}>
                      {t}
                    </span>
                  ))}
                </div>
                <ul className={styles.entryBullets}>
                  <li>
                    - Designed and developed a mobile application using React
                    Native to help new cat adopters through personalized content
                    delivery
                  </li>
                  <li>
                    - Engineered a clean UI design with custom spring and timing
                    animations, gesture-based swipe navigation, animated
                    progress indicators, and reusable card components across 20+
                    screens
                  </li>
                  <li>
                    - Built Supabase-backed APIs to enable users to create, store,
                    and share adoption experiences
                  </li>
                  <li>
                    - Built a location-based shelter finder that displays nearby
                    cat shelters using the user's real-time location
                  </li>
                </ul>
                <a
                  href="https://github.com/kylelin23/catAdoptionApp"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.projLink}
                >
                  View on GitHub →
                </a>
              </div>
            </div>

            <div className={styles.portfolioCard}>
              <div className={styles.cardImage}>
                <Link href="/?go=game">
                  <img
                    src="/assets/personal-website.png"
                    alt="Personal portfolio website screenshot"
                    className={styles.cardImageImg}
                  />
                </Link>
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.projectTitle}>
                  <Link href="/?go=game" className={styles.titleLink}>
                    Personal Website
                  </Link>
                </h2>
                <div className={`${styles.entrySub} ${styles.entrySubProject}`}>
                  <p className={styles.entryOrg}>
                    Full-Stack Website | React and MongoDB
                  </p>
                </div>
                <div className={styles.techBadgeRow}>
                  {["React", "Next.js", "MongoDB"].map((t) => (
                    <span key={t} className={styles.techBadge}>
                      {t}
                    </span>
                  ))}
                </div>
                <ul className={styles.entryBullets}>
                  <li>
                    - Designed and developed a full-stack personal portfolio
                    website with an interactive map game that rendered 20+
                    animated entities
                  </li>
                  <li>
                    - Implemented a physics-based pathing system, enabling
                    entities to autonomously navigate obstacles in real time
                  </li>
                  <li>
                    - Developed RESTful APIs using Next.js API routes and MongoDB
                    to dynamically deliver blog posts, projects, and comments,
                    enabling real-time comment submissions.
                  </li>
                </ul>
                <Link href="/?go=game" className={styles.projLink}>
                  View Project →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.resumeCard} ${styles.skillsCard}`}>
          <p className={styles.sectionTitle}>Skills</p>

          <p className={styles.skillGroupTitle}>Programming Languages</p>
          <div className={styles.skillsGrid}>
            {programmingLanguages.map((skill) => (
              <Skill
                key={skill.key}
                name={skill.name}
                img={skill.img}
                imgAlt={skill.imgAlt}
              />
            ))}
          </div>

          <p className={styles.skillGroupTitle}>Frameworks</p>
          <div className={styles.skillsGrid}>
            {frameworks.map((skill) => (
              <Skill
                key={skill.key}
                name={skill.name}
                img={skill.img}
                imgAlt={skill.imgAlt}
              />
            ))}
          </div>

          <p className={styles.skillGroupTitle}>Developer Tools</p>
          <div className={styles.skillsGrid}>
            {developerTools.map((skill) => (
              <Skill
                key={skill.key}
                name={skill.name}
                img={skill.img}
                imgAlt={skill.imgAlt}
              />
            ))}
          </div>

          <p className={styles.skillGroupTitle}>Certifications</p>
          <div className={styles.skillsGrid}>
            {certifications.map((skill) => (
              <Skill
                key={skill.key}
                name={skill.name}
                img={skill.img}
                imgAlt={skill.imgAlt}
              />
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <Link href="/?go=game" className={styles.footerBack}>
            ← Back to the Sea
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import styles from "./contact.module.css";

export default function Contact() {
  return (
    <div className={styles.page}>
      <div className={styles.topBackLinkWrapper}>
        <Link className={styles.backLink} href="/?go=game">
          ← Back to the Sea
        </Link>
      </div>

      <div className={styles.gridOverlay} />

      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={styles.ambientDot}
          style={{
            top: `${12 + i * 10}%`,
            left: `${8 + i * 11}%`,
            animationDuration: `${2.5 + i * 0.4}s`,
          }}
        />
      ))}

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.anchor}>⚓</div>
          <h1 className={styles.title}>Contact</h1>
          <p className={styles.subtitle}>Connect with me here!</p>
        </div>

        <div className={styles.card}>
          <Link
            className={styles.socialCard}
            href="https://www.linkedin.com/in/kyle-lin-584235295/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              className={styles.socialIcon}
              src="/assets/logos/LI-In-Bug.png"
              alt="LinkedIn Logo"
            />
            <span>LinkedIn</span>
          </Link>
          <Link
            className={styles.socialCard}
            href="https://github.com/kylelin23"
            target="_blank"
            rel="noreferrer"
          >
            <img
              className={styles.socialIcon}
              src="/assets/logos/githubLogo.png"
              alt="GitHub Logo"
            />
            <span>GitHub</span>
          </Link>
          <Link
            className={styles.socialCard}
            href="mailto:linkyle0924@gmail.com"
          >
            <img
              className={styles.socialIcon}
              src="/assets/logos/gmailIcon.webp"
              alt="Gmail Logo"
            />
            <span>Email</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

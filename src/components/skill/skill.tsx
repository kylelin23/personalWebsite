"use client";
import type { Skill } from "../../app/resumeData";
import styles from "./skill.module.css";

export default function Skill({ name, img, imgAlt }: Skill) {
  return (
    <div className={styles.card}>
      <img src={img} width={40} alt={imgAlt} className={styles.icon} />
      <span className={styles.label}>{name}</span>
    </div>
  );
}

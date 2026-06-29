"use client";

import styles from "./loadingScreen.module.css";

interface LoadingScreenProps {
  progress: number;
  loadText: string;
}

export default function LoadingScreen({
  progress,
  loadText,
}: LoadingScreenProps) {
  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.radialGradient} />
        <div className={styles.waveLayer}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className={styles.waveLine}
              style={{
                top: `${20 + i * 6}%`,
                background: `rgba(80,${160 + i * 6},240,0.8)`,
                transform: `scaleX(${0.8 + Math.sin(i) * 0.2})`,
              }}
            />
          ))}
        </div>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={styles.star}
            style={{
              width: i % 3 === 0 ? 4 : 2,
              height: i % 3 === 0 ? 4 : 2,
              background: `rgba(${180 + i * 3},${160 + i * 4},${100 + i * 2},0.6)`,
              bottom: `${5 + i * 4}%`,
              left: `${3 + i * 5}%`,
              animation: `starFloat ${3 + i * 0.4}s ease-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>

      <div className={styles.boatWrap}>
        <svg width="90" height="70" viewBox="0 0 90 70" fill="none">
          <path
            d="M10 40 Q45 55 80 40 L72 50 Q45 62 18 50 Z"
            fill="#c07030"
            stroke="#8a4010"
            strokeWidth="1.5"
          />
          <path d="M10 40 L80 40" stroke="#1e2d5a" strokeWidth="3" />
          <line
            x1="45"
            y1="40"
            x2="45"
            y2="5"
            stroke="#7a4010"
            strokeWidth="3"
          />
          <path
            d="M45 8 Q62 18 62 36 L45 36 Z"
            fill="rgba(242,228,182,0.95)"
            stroke="#b89050"
            strokeWidth="1"
          />
          <path d="M45 5 L55 9 L45 13 Z" fill="#c03020" />
          <path
            d="M5 52 Q20 48 35 52 Q50 56 65 52 Q80 48 88 52"
            stroke="rgba(140,200,255,0.5)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      <div className={styles.compassWrap}>
        <div className={styles.compassInner}>
          <div className={styles.ring} />
          <div className={`${styles.ring} ${styles.ringDelayed}`} />
          <div className={styles.compassFace}>
            <div className={styles.needle} />
            <div className={styles.northLabel}>N</div>
          </div>
        </div>
      </div>

      <div className={styles.landLeft}>
        <svg width="70" height="50" viewBox="0 0 70 50">
          <ellipse cx="35" cy="38" rx="32" ry="14" fill="#2a8a30" />
          <path d="M35 38 Q28 20 35 5 Q42 20 35 38Z" fill="#3a2a1a" />
        </svg>
      </div>
      <div className={styles.landRight}>
        <svg width="50" height="38" viewBox="0 0 50 38">
          <ellipse cx="25" cy="28" rx="22" ry="12" fill="#4a7a9a" />
          <path d="M20 28 L25 8 L30 28Z" fill="#7090b0" />
        </svg>
      </div>

      <div className={styles.content}>
        <div className={styles.title}>KYLE LIN</div>
        <div className={styles.subtitle}>Portfolio</div>

        <div className={styles.loadText}>
          {loadText}
          <span className={styles.blinkDots}> ···</span>
        </div>

        <div className={styles.progressWrap}>
          <div className={styles.ticksRow}>
            {Array.from({ length: 11 }).map((_, i) => (
              <div
                key={i}
                className={styles.tick}
                style={{
                  height: i % 5 === 0 ? 8 : 4,
                  background: `rgba(200,160,80,${progress / 100 > i / 10 ? 0.6 : 0.2})`,
                }}
              />
            ))}
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className={styles.percentText}>
            {Math.round(progress)}
            <span className={styles.percentSign}>%</span>
          </div>
        </div>

        <div className={styles.footerText}>Preparing your voyage</div>
      </div>
    </div>
  );
}

"use client";
import type { CSSProperties, ReactNode } from "react";
import { useEffect } from "react";
import styles from "./splashScreen.module.css";

export const SUBTITLES = [
  "Sail the seas to learn more about me",
  "Built with React and MongoDB",
  "Computer Science Major at Cal Poly SLO",
];

const GRID_TYPES = [
  "flag",
  "star",
  "compass",
  "rope",
  "cutlasses",
  "anchor",
  "chest",
  "wave",
  "spyglass",
];
const GRID_COORDS: [number, number][] = [
  [-180, -180],
  [-180, -90],
  [-180, 0],
  [-180, 90],
  [-180, 180],
  [-90, -180],
  [-90, -90],
  [-90, 0],
  [-90, 90],
  [-90, 180],
  [0, -180],
  [0, -90],
  [0, 90],
  [0, 180],
  [90, -180],
  [90, -90],
  [90, 0],
  [90, 90],
  [90, 180],
  [180, -180],
  [180, -90],
  [180, 0],
  [180, 90],
  [180, 180],
];
const WIDE_DECOS = GRID_COORDS.map(([x, y], i) => ({
  x,
  y,
  type: GRID_TYPES[i % GRID_TYPES.length],
  r: (i % 2 === 0 ? 1 : -1) * (8 + (i % 5) * 2),
  scale: 0.66 + (i % 4) * 0.045,
  o: 0.5 + (i % 3) * 0.07,
}));

const POSTER_DECOS = [
  {
    x: -120,
    y: -105,
    r: -23,
    title: "CAL POLY SLO",
    sub: "Mustangs by the sea",
    desc: "Computer Science, campus life, projects, and building things in San Luis Obispo.",
  },
  {
    x: -35,
    y: -135,
    r: 17,
    title: "CATS",
    sub: "Tiny chaos engineers",
    desc: "Curious cats, cozy naps, island mascots, and mysterious keyboard walking.",
  },
  {
    x: 58,
    y: -118,
    r: -14,
    title: "REACT.JS",
    sub: "Interactive UI craft",
    desc: "Components, hooks, canvas animations, state, routing, and polished web experiences.",
  },
  {
    x: 145,
    y: -92,
    r: 24,
    title: "AI",
    sub: "Future builder tools",
    desc: "Exploring intelligent systems, automation, creative workflows, and human-centered software.",
  },
  {
    x: -170,
    y: -8,
    r: 12,
    title: "WEB DEV",
    sub: "Browser worlds",
    desc: "Building interactive web experiences with modern technologies and playful design.",
  },
  {
    x: -82,
    y: -42,
    r: -20,
    title: "PROJECTS",
    sub: "Ideas in motion",
    desc: "A collection of experiments, apps, classwork, and late-night ideas.",
  },
  {
    x: 92,
    y: -28,
    r: 21,
    title: "CODE",
    sub: "Write · Debug · Ship",
    desc: "Turning ideas into clean, efficient, maintainable code.",
  },
  {
    x: 182,
    y: -2,
    r: -24,
    title: "TOOLS",
    sub: "Builder mindset",
    desc: "Debugging, experimenting, and building tools to solve real problems.",
  },
  {
    x: -145,
    y: 82,
    r: -15,
    title: "OCEAN MAPS",
    sub: "Portfolio voyage",
    desc: "A nautical world of islands, routes, secrets, and stories waiting to be explored.",
  },
  {
    x: -48,
    y: 128,
    r: 26,
    title: "DESIGN",
    sub: "Details matter",
    desc: "Motion, atmosphere, visual polish, and playful interfaces that feel alive.",
  },
  {
    x: 72,
    y: 95,
    r: -22,
    title: "MUSTANGS",
    sub: "Cal Poly pride",
    desc: "Learn by doing, build by trying, improve by shipping.",
  },
  {
    x: 162,
    y: 142,
    r: 18,
    title: "FUTURE",
    sub: "What comes next",
    desc: "More projects, more ideas, better design, and smarter tools.",
  },
  {
    x: -108,
    y: 205,
    r: 22,
    title: "SYSTEMS",
    sub: "Software thinking",
    desc: "Designing logic, structure, and interactions that work together.",
  },
  {
    x: 18,
    y: 232,
    r: -19,
    title: "MONGO DB",
    sub: "Data layer",
    desc: "Storing, organizing, and serving data for full-stack ideas.",
  },
  {
    x: 148,
    y: 198,
    r: 14,
    title: "UX",
    sub: "Guide the user",
    desc: "Clear controls, readable states, and interactions that make sense.",
  },
];

const SHAPE_CLIP: Record<string, string> = {
  circle: "circle(50% at 50% 50%)",
  square: "inset(8% round 18%)",
  rectangle: "inset(10% 24% round 14%)",
  octagon:
    "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
};

function ShapeFrame({
  children,
  border,
  shape = "circle",
  size = 60,
}: {
  children: ReactNode;
  border: string;
  shape?: string;
  size?: number;
}) {
  const clip = SHAPE_CLIP[shape] || SHAPE_CLIP.circle;
  return (
    <div className={styles.shapeFrame} style={{ width: size, height: size }}>
      <div
        className={styles.shapeBorder}
        style={{ background: border, clipPath: clip }}
      />
      <div className={styles.shapeInner} style={{ clipPath: clip }}>
        {children}
      </div>
    </div>
  );
}

function ImagePatch({
  src,
  border,
  shape = "circle",
  size = 60,
  imgSize = 34,
  filter,
}: {
  src: string;
  border: string;
  shape?: string;
  size?: number;
  imgSize?: number;
  filter?: string;
}) {
  return (
    <ShapeFrame border={border} shape={shape} size={size}>
      <img
        src={src}
        alt=""
        className={styles.patchImg}
        style={{
          width: imgSize,
          height: imgSize,
          filter: filter || "sepia(0.35) saturate(0.75) contrast(0.95)",
        }}
      />
    </ShapeFrame>
  );
}

function DecoIcon({ type, spin }: { type: string; spin?: boolean }) {
  switch (type) {
    case "flag":
      return (
        <svg width="70" height="92" viewBox="0 0 70 92">
          <line
            x1="8"
            y1="90"
            x2="8"
            y2="6"
            stroke="#3a2414"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M8 8 L62 22 L8 38 Z"
            fill="#1d160f"
            stroke="#3a2414"
            strokeWidth="2"
          />
          <circle cx="27" cy="21" r="6.5" fill="#ead7ad" />
          <path
            d="M22 26 L19 31 M32 26 L35 31"
            stroke="#ead7ad"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M20 18 L24.5 22.5 M24.5 18 L20 22.5"
            stroke="#1d160f"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M30 18 L34.5 22.5 M34.5 18 L30 22.5"
            stroke="#1d160f"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "compass":
      return (
        <div className={styles.compassIcon}>
          <div
            className={`${styles.compassNeedle} ${spin ? styles.compassNeedleSpin : ""}`}
          />
          <div className={styles.compassLabel}>N</div>
        </div>
      );
    case "rope":
      return (
        <svg width="58" height="58" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke="#8a5a2a"
            strokeWidth="5"
          />
          <circle
            cx="32"
            cy="32"
            r="18"
            fill="none"
            stroke="#a06a32"
            strokeWidth="5"
          />
          <circle
            cx="32"
            cy="32"
            r="10"
            fill="none"
            stroke="#8a5a2a"
            strokeWidth="5"
          />
          <path
            d="M32 6 L32 1"
            stroke="#5a3514"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "cutlasses":
      return (
        <svg width="68" height="68" viewBox="0 0 74 74">
          <g transform="rotate(45 37 37)">
            <rect
              x="34"
              y="6"
              width="6"
              height="40"
              rx="2"
              fill="#c8c8c8"
              stroke="#3a2414"
              strokeWidth="1.5"
            />
            <rect x="30" y="44" width="14" height="8" rx="2" fill="#3a2414" />
            <rect x="34" y="50" width="6" height="14" rx="2" fill="#5a3514" />
          </g>
          <g transform="rotate(-45 37 37)">
            <rect
              x="34"
              y="6"
              width="6"
              height="40"
              rx="2"
              fill="#c8c8c8"
              stroke="#3a2414"
              strokeWidth="1.5"
            />
            <rect x="30" y="44" width="14" height="8" rx="2" fill="#3a2414" />
            <rect x="34" y="50" width="6" height="14" rx="2" fill="#5a3514" />
          </g>
        </svg>
      );
    case "anchor":
      return (
        <svg width="50" height="56" viewBox="0 0 50 56">
          <circle
            cx="25"
            cy="10"
            r="6"
            fill="none"
            stroke="#3a2414"
            strokeWidth="3"
          />
          <line
            x1="25"
            y1="16"
            x2="25"
            y2="44"
            stroke="#3a2414"
            strokeWidth="3"
          />
          <line
            x1="13"
            y1="24"
            x2="37"
            y2="24"
            stroke="#3a2414"
            strokeWidth="3"
          />
          <path
            d="M7 34 Q25 54 43 34"
            fill="none"
            stroke="#3a2414"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "star":
      return (
        <svg width="40" height="40" viewBox="0 0 64 64">
          <path
            d="M32 6 L39 27 L60 32 L39 37 L32 58 L25 37 L4 32 L25 27 Z"
            fill="#ead7ad"
            stroke="#3a2414"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "chest":
      return (
        <svg width="54" height="46" viewBox="0 0 64 56">
          <rect
            x="6"
            y="26"
            width="52"
            height="26"
            rx="4"
            fill="#5a3514"
            stroke="#2a1608"
            strokeWidth="2.5"
          />
          <path
            d="M6 26 Q32 6 58 26"
            fill="#6a4018"
            stroke="#2a1608"
            strokeWidth="2.5"
          />
          <rect
            x="26"
            y="30"
            width="12"
            height="14"
            rx="2"
            fill="#c8a020"
            stroke="#2a1608"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "spyglass":
      return (
        <svg width="62" height="46" viewBox="0 0 64 48">
          <path
            d="M6 38 L48 12 L56 24 L14 50 Z"
            fill="#6a4018"
            stroke="#2a1608"
            strokeWidth="2"
          />
          <circle cx="9" cy="40" r="6" fill="#2a1608" />
          <circle cx="9" cy="40" r="3" fill="#1d160f" />
        </svg>
      );
    case "wave":
      return (
        <svg width="70" height="26" viewBox="0 0 70 26">
          <path
            d="M2 16 Q12 4 22 16 T42 16 T62 16"
            stroke="#5a7a92"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case "react":
      return (
        <ShapeFrame border="#2a5a5e" shape="octagon" size={62}>
          <svg width="32" height="32" viewBox="-11.5 -11.5 23 23">
            <circle r="2.2" fill="#3a6a6e" />
            <g stroke="#3a6a6e" strokeWidth="1" fill="none" opacity="0.85">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
        </ShapeFrame>
      );
    case "calpoly":
      return (
        <ImagePatch
          src="/assets/logos/calPolyLogo2.svg.png"
          border="#1e4d2b"
          shape="circle"
          imgSize={38}
        />
      );
    case "aws":
      return (
        <ImagePatch
          src="/assets/logos/awsIcon2.png"
          border="#3a2414"
          shape="square"
          size={78}
          imgSize={46}
        />
      );
    case "python":
      return (
        <ImagePatch
          src="/assets/logos/python-logo-only.png"
          border="#2b5b84"
          shape="rectangle"
          size={100}
          imgSize={36}
        />
      );
    case "github":
      return (
        <ImagePatch
          src="/assets/logos/githubLogo.png"
          border="#24292e"
          shape="circle"
          size={78}
          imgSize={52}
        />
      );
    default:
      return null;
  }
}

interface SplashScreenProps {
  entering: boolean;
  transitioning: boolean;
  subtitleIndex: number;
  onExplore: () => void;
}

export default function SplashScreen({
  entering,
  transitioning,
  subtitleIndex,
  onExplore,
}: SplashScreenProps) {
  useEffect(() => {
    const checkBottom = () => {
      const el = document.elementFromPoint(
        window.innerWidth / 2,
        window.innerHeight - 5,
      );
      console.log("bottom element:", el);
      console.log(
        "bottom bg:",
        el ? getComputedStyle(el).backgroundColor : "none",
      );
      console.log({
        innerHeight: window.innerHeight,
        htmlHeight: document.documentElement.clientHeight,
        bodyHeight: document.body.clientHeight,
      });
    };

    setTimeout(checkBottom, 500);
    setTimeout(checkBottom, 1500);
    setTimeout(checkBottom, 3000);
  }, []);

  return (
    <div className={styles.splashRoot}>
      <div className={styles.bgGradient} />
      <div className={styles.bgGrain} />
      <div className={styles.horizonShadow} />

      <div
        className={`${styles.scene} ${entering ? styles.sceneEntering : ""}`}
      >
        {POSTER_DECOS.map((p, i) => (
          <div
            key={i}
            className={styles.posterDeco}
            style={{
              left: `calc(50% + ${p.x}vw)`,
              top: `calc(50% + ${p.y}vh)`,
              transform: `translate(-50%,-50%) rotate(${p.r}deg)`,
            }}
          >
            <div className={styles.posterDecoTexture} />
            <div className={`${styles.cornerDot} ${styles.cornerDotTL}`} />
            <div className={`${styles.cornerDot} ${styles.cornerDotTR}`} />
            <div className={`${styles.cornerDot} ${styles.cornerDotBL}`} />
            <div className={`${styles.cornerDot} ${styles.cornerDotBR}`} />
            <h2 className={styles.posterDecoTitle}>{p.title}</h2>
            <div className={styles.posterDecoSub}>{p.sub}</div>
            <p className={styles.posterDecoDesc}>{p.desc}</p>
          </div>
        ))}

        {WIDE_DECOS.map((d, i) => (
          <div
            key={i}
            className={styles.wideDeco}
            style={{
              left: `calc(50% + ${d.x}vw)`,
              top: `calc(50% + ${d.y}vh)`,
              transform: `translate(-50%,-50%) rotate(${d.r}deg) scale(${d.scale})`,
              opacity: d.o,
            }}
          >
            <DecoIcon type={d.type} />
          </div>
        ))}

        <div
          className={`${styles.posterCard} ${transitioning ? styles.posterCardZooming : ""}`}
        >
          <div className={styles.posterCardTexture} />

          <div className={`${styles.posterPeg} ${styles.posterPegTL}`} />
          <div className={`${styles.posterPeg} ${styles.posterPegTR}`} />
          <div className={`${styles.posterPeg} ${styles.posterPegBL}`} />
          <div className={`${styles.posterPeg} ${styles.posterPegBR}`} />

          <div className={styles.anchorWrap}>
            <div className={styles.posterAnchor}>⚓</div>
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const dx = Math.cos(angle) * 40 + (i % 2 === 0 ? 10 : -10);
              const dy = Math.sin(angle) * 40 - 20 - i * 4;
              return (
                <div
                  key={i}
                  className={styles.sparkle}
                  style={
                    {
                      width: i % 3 === 0 ? 4 : 2.5,
                      height: i % 3 === 0 ? 4 : 2.5,
                      background: i % 2 === 0 ? "#5a3514" : "#2a180d",
                      animation: `sparkleDrift ${2.5 + (i % 3) * 0.6}s ease-out ${i * 0.35}s infinite`,
                      "--dx": `${dx}px`,
                      "--dy": `${dy}px`,
                    } as CSSProperties
                  }
                />
              );
            })}
          </div>

          <h1 className={styles.posterTitle}>Hey, I'm Kyle Lin</h1>

          <div className={styles.posterDivider}>
            <div className={styles.posterDividerInner}>
              <div className={styles.posterDividerLineLeft} />
              <div className={styles.posterDividerStar}>✦</div>
              <div className={styles.posterDividerLineRight} />
            </div>
          </div>

          <div className={styles.subtitleWrap}>
            <p key={subtitleIndex} className={styles.subtitleText}>
              {SUBTITLES[subtitleIndex]}
            </p>
          </div>

          <div
            className={`${styles.btnWrap} ${entering ? styles.btnWrapLocked : ""}`}
          >
            <button
              className={styles.posterBtn}
              onClick={onExplore}
              disabled={transitioning}
            >
              Explore
            </button>
          </div>
        </div>

        <div className={`${styles.namedDeco} ${styles.namedDecoCalpoly}`}>
          <DecoIcon type="calpoly" />
        </div>
        <div className={`${styles.namedDeco} ${styles.namedDecoReact}`}>
          <DecoIcon type="react" />
        </div>
        <div className={`${styles.namedDeco} ${styles.namedDecoAws}`}>
          <DecoIcon type="aws" />
        </div>
        <div className={`${styles.namedDeco} ${styles.namedDecoPython}`}>
          <DecoIcon type="python" />
        </div>
        <div className={`${styles.namedDeco} ${styles.namedDecoGithub}`}>
          <DecoIcon type="github" />
        </div>
      </div>

      {transitioning && <div className={styles.transitionOverlay} />}
    </div>
  );
}

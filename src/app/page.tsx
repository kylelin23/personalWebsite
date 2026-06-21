"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ISLE_DATA,
  ROUTES,
  THEMES,
  SUBTITLES,
  shouldSkipHomePosterEntrance,
  type Isle,
  type Pt,
  type CS,
  type SS,
} from "./game-data";
import { useGameLoop } from "./use-game-loop";

export default function Home() {
  const initialSkipPosterEntrance = shouldSkipHomePosterEntrance();
  const router = useRouter();
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const shipRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    ang: 0,
    spd: 0,
    ready: false,
  });
  const keysRef = useRef<Record<string, boolean>>({});
  const wakeRef = useRef<{ wx: number; wy: number; age: number; ma: number }[]>(
    [],
  );
  const trailRef = useRef<Pt[]>([]);
  const tickRef = useRef(0);
  const animRef = useRef(0);
  const islesRef = useRef<Isle[]>([]);
  const nearRef = useRef<Isle | null>(null);
  const whalesRef = useRef<CS[]>([]);
  const turtlesRef = useRef<CS[]>([]);
  const serpRef = useRef<SS>({ x: 0, y: 0, vx: 0, vy: 0, ang: 0, trail: [] });
  const creatureInitRef = useRef(false);
  const gameStartRef = useRef(0);
  const [near, setNear] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [screen, setScreen] = useState<"loading" | "splash" | "game">("splash");
  const [progress, setProgress] = useState(0);
  const [loadText, setLoadText] = useState("Creating Map");
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [skipPosterEntrance] = useState(initialSkipPosterEntrance);
  const [entering, setEntering] = useState(!initialSkipPosterEntrance);
  const [returning, setReturning] = useState(initialSkipPosterEntrance);
  const skipNextSplashRef = useRef(initialSkipPosterEntrance);

  // Call the hook at the top level
  useGameLoop(
    cvsRef,
    {
      shipRef,
      keysRef,
      wakeRef,
      trailRef,
      tickRef,
      animRef,
      islesRef,
      nearRef,
      whalesRef,
      turtlesRef,
      serpRef,
      creatureInitRef,
      gameStartRef,
      skipNextSplashRef,
      setScreen,
    },
    {
      setNear,
      router,
    },
    screen === "game"
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("go") === "game") {
      window.history.replaceState({}, "", "/");
      setScreen("game");
      return;
    }
    if (skipPosterEntrance) {
      window.sessionStorage.removeItem("skipHomePosterEnter");
      setEntering(false);
    }
  }, [skipPosterEntrance]);

  // Cycle through subtitle phrases + camera-approach entrance
  useEffect(() => {
    if (screen !== "splash") return;
    setSubtitleIndex(0);
    setTransitioning(false);

    const isReturn = skipPosterEntrance || skipNextSplashRef.current;
    skipNextSplashRef.current = false;
    setEntering(!isReturn);
    setReturning(isReturn);

    const enterTimeout = isReturn
      ? undefined
      : setTimeout(() => setEntering(false), 750);
    const returnTimeout = isReturn
      ? setTimeout(() => setReturning(false), 700)
      : undefined;
    const iv = setInterval(() => {
      setSubtitleIndex((i) => (i + 1) % SUBTITLES.length);
    }, 3200);
    return () => {
      clearInterval(iv);
      if (enterTimeout) clearTimeout(enterTimeout);
      if (returnTimeout) clearTimeout(returnTimeout);
    };
  }, [screen, skipPosterEntrance]);

  // Loading screen
  if (screen === "loading") {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          background: "#030912",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia,serif",
          color: "#f5e6c0",
          overflow: "hidden",
        }}
      >
        <style>{`
        @keyframes pulse{0%{opacity:0.15;transform:scale(1)}100%{opacity:0.7;transform:scale(1.8)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes waveScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes starFloat{0%{opacity:0;transform:translateY(0)}10%{opacity:1}90%{opacity:1}100%{opacity:0;transform:translateY(-80px)}}
        @keyframes compassSpin{0%{transform:rotate(0deg)}30%{transform:rotate(120deg)}60%{transform:rotate(240deg)}100%{transform:rotate(360deg)}}
        @keyframes shimmer{0%,100%{opacity:0.5}50%{opacity:1}}
        @keyframes barShine{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes boatRock{0%,100%{transform:rotate(-4deg) translateY(0)}50%{transform:rotate(4deg) translateY(-6px)}}
        @keyframes waveRise{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.4)}}
        @keyframes ringPulse{0%{transform:scale(0.8);opacity:0.8}100%{transform:scale(2.2);opacity:0}}
      `}</style>

        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 60%,#0a2040 0%,#030912 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "200%",
              height: "100%",
              animation: "waveScroll 8s linear infinite",
              opacity: 0.12,
            }}
          >
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 2,
                  top: `${20 + i * 6}%`,
                  background: `rgba(80,${160 + i * 6},240,0.8)`,
                  borderRadius: 2,
                  transform: `scaleX(${0.8 + Math.sin(i) * 0.2})`,
                }}
              />
            ))}
          </div>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: i % 3 === 0 ? 4 : 2,
                height: i % 3 === 0 ? 4 : 2,
                borderRadius: "50%",
                background: `rgba(${180 + i * 3},${160 + i * 4},${100 + i * 2},0.6)`,
                bottom: `${5 + i * 4}%`,
                left: `${3 + i * 5}%`,
                animation: `starFloat ${3 + i * 0.4}s ease-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "28%",
            left: "50%",
            transform: "translateX(-50%)",
            animation: "boatRock 3s ease-in-out infinite",
            zIndex: 3,
          }}
        >
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

        <div
          style={{ position: "absolute", top: "12%", right: "12%", zIndex: 3 }}
        >
          <div style={{ position: "relative", width: 80, height: 80 }}>
            <div
              style={{
                position: "absolute",
                inset: -10,
                borderRadius: "50%",
                border: "1.5px solid rgba(200,168,80,0.3)",
                animation: "ringPulse 2s ease-out infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: -10,
                borderRadius: "50%",
                border: "1.5px solid rgba(200,168,80,0.3)",
                animation: "ringPulse 2s ease-out 0.7s infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "rgba(8,20,40,0.95)",
                border: "2px solid #c8a870",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 4,
                  height: 32,
                  top: 8,
                  left: "calc(50% - 2px)",
                  animation:
                    "compassSpin 4s cubic-bezier(0.4,0,0.6,1) infinite",
                  transformOrigin: "50% 75%",
                  borderRadius: 2,
                  background:
                    "linear-gradient(to bottom,#ff4444 50%,#c8a870 50%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 4,
                  fontSize: 9,
                  fontWeight: "bold",
                  color: "#ff5555",
                  letterSpacing: 1,
                }}
              >
                N
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: "6%",
            bottom: "22%",
            opacity: 0.18,
            zIndex: 2,
          }}
        >
          <svg width="70" height="50" viewBox="0 0 70 50">
            <ellipse cx="35" cy="38" rx="32" ry="14" fill="#2a8a30" />
            <path d="M35 38 Q28 20 35 5 Q42 20 35 38Z" fill="#3a2a1a" />
          </svg>
        </div>
        <div
          style={{
            position: "absolute",
            right: "8%",
            bottom: "18%",
            opacity: 0.14,
            zIndex: 2,
          }}
        >
          <svg width="50" height="38" viewBox="0 0 50 38">
            <ellipse cx="25" cy="28" rx="22" ry="12" fill="#4a7a9a" />
            <path d="M20 28 L25 8 L30 28Z" fill="#7090b0" />
          </svg>
        </div>

        <div style={{ position: "relative", textAlign: "center", zIndex: 4 }}>
          <div
            style={{
              fontSize: "2.6rem",
              fontWeight: "bold",
              letterSpacing: 4,
              marginBottom: 6,
              background: "linear-gradient(90deg,#c8a060,#ffd060,#c8a060)",
              backgroundSize: "200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "barShine 2.5s linear infinite",
              filter: "drop-shadow(0 0 20px rgba(200,160,60,0.4))",
            }}
          >
            KYLE LIN
          </div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 8,
              color: "rgba(200,168,112,0.5)",
              textTransform: "uppercase",
              marginBottom: 32,
            }}
          >
            Portfolio
          </div>

          <div
            style={{
              marginBottom: 10,
              fontSize: "0.85rem",
              letterSpacing: 4,
              color: "#c8a870",
              textTransform: "uppercase",
              animation: "shimmer 1.5s ease-in-out infinite",
            }}
          >
            {loadText}
            <span style={{ animation: "blink 0.8s infinite" }}> ···</span>
          </div>

          <div
            style={{ position: "relative", width: 320, margin: "0 auto 10px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              {Array.from({ length: 11 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 1,
                    height: i % 5 === 0 ? 8 : 4,
                    background: `rgba(200,160,80,${progress / 100 > i / 10 ? 0.6 : 0.2})`,
                    transition: "all 0.3s",
                  }}
                />
              ))}
            </div>
            <div
              style={{
                height: 4,
                background: "rgba(200,160,80,0.12)",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid rgba(200,160,80,0.15)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg,#6a3808,#c8a020,#ffd060)",
                  borderRadius: 2,
                  transition: "width 0.12s ease",
                  boxShadow: "0 0 12px rgba(255,200,60,0.6)",
                  backgroundSize: "200%",
                  animation: "barShine 1.5s linear infinite",
                }}
              />
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: "1.8rem",
                fontWeight: "bold",
                color: "#f5e6c0",
                letterSpacing: 2,
                textShadow: "0 0 20px rgba(200,160,80,0.5)",
              }}
            >
              {Math.round(progress)}
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "rgba(200,168,112,0.5)",
                  marginLeft: 2,
                }}
              >
                %
              </span>
            </div>
          </div>

          <div
            style={{
              fontSize: 9,
              color: "rgba(200,160,80,0.25)",
              letterSpacing: 4,
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            Preparing your voyage
          </div>
        </div>
      </div>
    );
  }

  // Splash screen
  if (screen === "splash") {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          background: "#120d09",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia,serif",
          overflow: "hidden",
          perspective: 1200,
        }}
      >
        <style>{`
      @keyframes glow{0%,100%{text-shadow:0 0 18px rgba(60,35,10,.25)}50%{text-shadow:0 0 36px rgba(80,45,15,.55)}}
      @keyframes btnGlow{0%,100%{box-shadow:0 0 10px rgba(60,35,10,.15)}50%{box-shadow:0 0 24px rgba(60,35,10,.35)}}
      @keyframes staggerIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      @keyframes anchorBob{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-10px) scale(1.04)}}
      @keyframes subtitleFade{0%{opacity:0;transform:translateY(4px)}15%{opacity:1;transform:translateY(0)}85%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-4px)}}
      @keyframes sparkleDrift{0%{opacity:0;transform:translate(0,0) scale(0.4)}15%{opacity:1}70%{opacity:0.8}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1)}}
      @keyframes shipDrift{0%{transform:translateX(-15vw)}100%{transform:translateX(115vw)}}
      @keyframes shipDriftRev{0%{transform:translateX(115vw) scaleX(-1)}100%{transform:translateX(-15vw) scaleX(-1)}}
      @keyframes posterEnter{
        0%{transform:translate3d(0,0,-2600px) scale(.55);filter:blur(2.5px) brightness(.65)}
        100%{transform:translate3d(0,0,0) scale(1);filter:blur(0) brightness(1)}
      }
      /* FIXED: posterZoom zoom effect removed to transition directly into the scene */
      @keyframes posterDiveIn{
        0%{transform:translate(-50%,-50%) rotate(-1deg) scale(1);opacity:1;filter:blur(0)}
        100%{transform:translate(-50%,-50%) rotate(-1deg) scale(2.4);opacity:0;filter:blur(7px)}
      }
      @keyframes posterRiseIn{
        0%{transform:translate(-50%,-50%) rotate(-1deg) scale(1.12);opacity:0;filter:blur(5px)}
        100%{transform:translate(-50%,-50%) rotate(-1deg) scale(1);opacity:1;filter:blur(0)}
      }
      @keyframes oceanWashIn{0%{opacity:0}100%{opacity:1}}
      @keyframes oceanWashOut{0%{opacity:1}100%{opacity:0}}
    `}</style>

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 38%, #4b3522 0%, #2b1d12 48%, #100b07 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.16,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,.04) 1px, transparent 3px), repeating-linear-gradient(90deg, transparent 0px, rgba(0,0,0,.05) 1px, transparent 4px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: "6%",
            top: "12%",
            width: 180,
            height: 260,
            border: "10px solid #24160c",
            background:
              "linear-gradient(135deg, rgba(70,150,220,.45), rgba(255,190,90,.25))",
            boxShadow: "0 0 80px rgba(255,180,80,.18)",
            opacity: 0.45,
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "16%",
            left: "12%",
            right: "12%",
            height: 18,
            background: "#2a180d",
            boxShadow: "0 20px 50px rgba(0,0,0,.55)",
            opacity: 0.75,
          }}
        />

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            willChange: "transform,filter",
            animation: entering
              ? "posterEnter .75s cubic-bezier(0.6,0.04,0.98,0.335) both"
              : "none",
          }}
        >
          {/* Full wall of background posters */}
          {[
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
          ].map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `calc(50% + ${p.x}vw)`,
                top: `calc(50% + ${p.y}vh)`,
                transform: `translate(-50%,-50%) rotate(${p.r}deg)`,
                width: "min(520px,64vw)",
                minHeight: "min(610px,68vh)",
                padding: "72px 40px 46px",
                background: "linear-gradient(135deg,#ead7ad,#c6a06a)",
                border: "9px solid #3a2414",
                boxShadow:
                  "0 38px 85px rgba(0,0,0,.65), inset 0 0 52px rgba(80,40,10,.22)",
                color: "#1d160f",
                textAlign: "center",
                zIndex: 3,
                opacity: 0.74,
                pointerEvents: "none",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.1,
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,.12) 1px, transparent 3px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#171717",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#171717",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 14,
                  left: 14,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#171717",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 14,
                  right: 14,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#171717",
                }}
              />
              <h2
                style={{
                  position: "relative",
                  zIndex: 2,
                  fontSize: "2rem",
                  margin: "0 0 12px",
                  letterSpacing: 4,
                  color: "#1d160f",
                }}
              >
                {p.title}
              </h2>
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  fontSize: 12,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  opacity: 0.68,
                  marginBottom: 28,
                }}
              >
                {p.sub}
              </div>
              <p
                style={{
                  position: "relative",
                  zIndex: 2,
                  fontSize: 16,
                  lineHeight: 1.6,
                  maxWidth: 380,
                  margin: "0 auto",
                  color: "rgba(29,22,15,.78)",
                }}
              >
                {p.desc}
              </p>
            </div>
          ))}

          {/* Main Poster card */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%) rotate(-1deg)",
              width: "min(620px,82vw)",
              minHeight: "min(720px,78vh)",
              padding: "56px 48px",
              zIndex: 5,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg,#ead7ad,#c6a06a)",
              border: "10px solid #3a2414",
              boxShadow:
                "0 40px 90px rgba(0,0,0,.75), 0 10px 22px rgba(0,0,0,.55), inset 0 0 55px rgba(80,40,10,.22)",
              color: "#1d160f",
              overflow: "hidden",
              animation: transitioning
                ? "posterDiveIn 0.65s cubic-bezier(0.6,0.04,0.98,0.335) forwards"
                : returning
                  ? "posterRiseIn 0.6s cubic-bezier(0.16,1,0.3,1) both"
                  : "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.12,
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,.12) 1px, transparent 3px)",
                pointerEvents: "none",
              }}
            />

            {[
              { top: 14, left: 14 },
              { top: 14, right: 14 },
              { bottom: 14, left: 14 },
              { bottom: 14, right: 14 },
            ].map((p, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  ...p,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 35% 30%, #777, #171717)",
                  boxShadow: "0 2px 6px rgba(0,0,0,.55)",
                  zIndex: 8,
                }}
              />
            ))}

            <div
              style={{
                position: "relative",
                display: "inline-block",
                marginBottom: 20,
                zIndex: 2,
              }}
            >
              <div
                style={{
                  fontSize: 64,
                  animation: "anchorBob 3.5s ease-in-out infinite",
                  display: "inline-block",
                  filter: "drop-shadow(0 0 12px rgba(60,35,10,.35))",
                }}
              >
                ⚓
              </div>
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const dx = Math.cos(angle) * 40 + (i % 2 === 0 ? 10 : -10);
                const dy = Math.sin(angle) * 40 - 20 - i * 4;
                return (
                  <div
                    key={i}
                    style={
                      {
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: i % 3 === 0 ? 4 : 2.5,
                        height: i % 3 === 0 ? 4 : 2.5,
                        borderRadius: "50%",
                        background: i % 2 === 0 ? "#5a3514" : "#2a180d",
                        boxShadow: "0 0 6px rgba(60,35,10,0.45)",
                        pointerEvents: "none",
                        "--dx": `${dx}px`,
                        "--dy": `${dy}px`,
                        animation: `sparkleDrift ${2.5 + (i % 3) * 0.6}s ease-out ${i * 0.35}s infinite`,
                      } as React.CSSProperties
                    }
                  />
                );
              })}
            </div>

            <h1
              style={{
                position: "relative",
                zIndex: 2,
                fontSize: "3.2rem",
                fontWeight: "bold",
                margin: "0 0 4px",
                letterSpacing: 4,
                animation: "glow 3s ease-in-out infinite",
                color: "#1d160f",
                minHeight: "1.2em",
              }}
            >
              Hey, I'm Kyle Lin
            </h1>

            <div
              style={{
                position: "relative",
                zIndex: 2,
                animation: returning
                  ? "none"
                  : "staggerIn 0.7s 1.3s ease forwards",
                opacity: returning ? 1 : 0,
                marginBottom: 36,
                marginTop: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 1,
                    background:
                      "linear-gradient(to right,transparent,rgba(40,24,12,0.55))",
                  }}
                />
                <div style={{ fontSize: 14, color: "rgba(40,24,12,0.65)" }}>
                  ✦
                </div>
                <div
                  style={{
                    width: 60,
                    height: 1,
                    background:
                      "linear-gradient(to left,transparent,rgba(40,24,12,0.55))",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 2,
                animation: returning
                  ? "none"
                  : "staggerIn 0.7s 1.45s ease forwards",
                opacity: returning ? 1 : 0,
                marginBottom: 44,
                height: 20,
              }}
            >
              <p
                key={subtitleIndex}
                style={{
                  fontSize: 13,
                  color: "rgba(35,20,10,0.82)",
                  letterSpacing: 2,
                  margin: 0,
                  animation: "subtitleFade 3.2s ease forwards",
                }}
              >
                {SUBTITLES[subtitleIndex]}
              </p>
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 2,
                animation: returning
                  ? "none"
                  : "staggerIn 0.7s 1.6s ease forwards",
                opacity: returning ? 1 : 0,
                pointerEvents: entering ? "none" : "auto",
              }}
            >
              <button
                onClick={() => {
                  setReturning(false);
                  setTransitioning(true);
                  setTimeout(() => setScreen("game"), 600);
                }}
                disabled={transitioning}
                style={{
                  background: "transparent",
                  border: "2px solid #3a2414",
                  borderRadius: 2,
                  color: "#1d160f",
                  fontFamily: "Georgia,serif",
                  fontSize: "1rem",
                  letterSpacing: 6,
                  padding: "16px 60px",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  transition: "all 0.25s ease",
                  animation: "btnGlow 3s ease-in-out infinite",
                }}
                onMouseEnter={(e) => {
                  const b = e.currentTarget;
                  b.style.background = "rgba(60,35,10,.12)";
                  b.style.boxShadow = "0 0 30px rgba(60,35,10,.35)";
                  b.style.letterSpacing = "8px";
                }}
                onMouseLeave={(e) => {
                  const b = e.currentTarget;
                  b.style.background = "transparent";
                  b.style.boxShadow = "";
                  b.style.letterSpacing = "6px";
                }}
              >
                Explore
              </button>
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 2,
                animation: returning
                  ? "none"
                  : "staggerIn 0.7s 1.75s ease forwards",
                opacity: returning ? 1 : 0,
                marginTop: 22,
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  color: "rgba(35,20,10,0.6)",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                WASD or arrow keys to sail · Click islands to visit
              </p>
            </div>
          </div>
        </div>

        {transitioning && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#0b1d35",
              zIndex: 10,
              animation: "oceanWashIn 0.55s ease-in forwards",
              pointerEvents: "none",
            }}
          />
        )}
        {returning && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#0b1d35",
              zIndex: 10,
              animation: "oceanWashOut 0.6s ease-out both",
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // GAME SCREEN - COMPLETE
  // ═══════════════════════════════════════════════════════════════
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#0b1d35",
        fontFamily: "Georgia,serif",
      }}
    >
      <canvas
        ref={cvsRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 16,
          color: "#f5e6c0",
          pointerEvents: "none",
          zIndex: 5,
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: "bold",
            textShadow: "0 0 10px rgba(200,168,80,.5)",
          }}
        >
          Hey, I'm Kyle Lin
        </div>
        <div
          style={{ fontSize: 10, color: "rgba(200,168,112,.5)", marginTop: 3 }}
        >
          WASD / ↑↓←→ to sail · E or click an island to visit
        </div>
      </div>
      {showTutorial && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
            background: "rgba(3,9,18,0.6)",
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            style={{
              background: "rgba(8,18,40,0.97)",
              border: "1px solid rgba(200,168,80,0.4)",
              borderRadius: 16,
              padding: "40px 52px",
              textAlign: "center",
              fontFamily: "Georgia,serif",
              color: "#f5e6c0",
              maxWidth: 420,
              boxShadow: "0 0 60px rgba(0,0,0,0.8)",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 16 }}>⚓</div>
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: "bold",
                letterSpacing: 3,
                margin: "0 0 8px",
                color: "#f5e6c0",
              }}
            >
              Welcome Aboard
            </h2>
            <p
              style={{
                fontSize: 12,
                color: "rgba(200,168,112,0.6)",
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 28,
              }}
            >
              Captain's Briefing
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px 24px",
                marginBottom: 28,
                textAlign: "left",
              }}
            >
              {[
                { keys: "W A S D", desc: "Sail the ship" },
                { keys: "↑ ↓ ← →", desc: "Arrow keys work too" },
                { keys: "E", desc: "Visit nearby island" },
                { keys: "Click", desc: "Click island to visit" },
              ].map(({ keys, desc }) => (
                <div
                  key={keys}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <kbd
                    style={{
                      background: "rgba(200,160,50,.15)",
                      border: "1px solid rgba(200,160,80,0.4)",
                      borderRadius: 5,
                      padding: "3px 9px",
                      fontSize: 11,
                      fontFamily: "Georgia,serif",
                      color: "#c8a870",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {keys}
                  </kbd>
                  <span
                    style={{ fontSize: 12, color: "rgba(200,168,112,0.7)" }}
                  >
                    {desc}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                height: 1,
                background: "rgba(200,160,80,0.15)",
                marginBottom: 24,
              }}
            />
            <p
              style={{
                fontSize: 12,
                color: "rgba(200,168,112,0.55)",
                marginBottom: 24,
                letterSpacing: 1,
              }}
            >
              Sail to each island to explore a section of my portfolio. The ship
              is you!
            </p>

            <button
              onClick={() => setShowTutorial(false)}
              style={{
                background: "transparent",
                border: "2px solid #c8a870",
                borderRadius: 4,
                color: "#f5e6c0",
                fontFamily: "Georgia,serif",
                fontSize: "0.9rem",
                letterSpacing: 5,
                padding: "12px 40px",
                cursor: "pointer",
                textTransform: "uppercase",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(200,160,70,.15)";
                e.currentTarget.style.boxShadow =
                  "0 0 24px rgba(200,160,70,.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Set Sail
            </button>
          </div>
        </div>
      )}
      {near && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(8,18,35,.93)",
            border: `1px solid ${THEMES[ISLE_DATA.find((i) => i.id === near)!.theme].accent}`,
            borderRadius: 9,
            padding: "10px 26px",
            color: "#f5e6c0",
            fontSize: 13,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          Press{" "}
          <kbd
            style={{
              background: "rgba(200,160,50,.2)",
              border: "1px solid #c8a870",
              borderRadius: 3,
              padding: "1px 7px",
              fontWeight: "bold",
              fontFamily: "Georgia,serif",
            }}
          >
            E
          </kbd>{" "}
          or click to visit {ISLE_DATA.find((i) => i.id === near)?.name}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: "18px",
          right: "18px",
          display: "grid",
          gridTemplateColumns: "38px 38px 38px",
          gridTemplateRows: "38px 38px 38px",
          gap: 4,
          zIndex: 5,
        }}
      >
        {(["", "dU", "", "dL", "dD", "dR"] as const).map((id, i) => {
          if (!id) return <div key={i} />;
          const label =
            id === "dU" ? "↑" : id === "dD" ? "↓" : id === "dL" ? "←" : "→";
          const key =
            id === "dU"
              ? "ArrowUp"
              : id === "dD"
                ? "ArrowDown"
                : id === "dL"
                  ? "ArrowLeft"
                  : "ArrowRight";
          return (
            <div
              key={id}
              onPointerDown={(e) => {
                e.preventDefault();
                keysRef.current[key] = true;
              }}
              onPointerUp={() => (keysRef.current[key] = false)}
              onPointerLeave={() => (keysRef.current[key] = false)}
              style={{
                background: "rgba(200,160,70,.15)",
                border: "1px solid rgba(200,160,70,.4)",
                borderRadius: 6,
                color: "#c8a870",
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
                touchAction: "none",
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
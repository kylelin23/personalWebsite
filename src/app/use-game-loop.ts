import { useEffect, type RefObject } from "react";
import { useRouter } from "next/navigation";
import {
  ISLE_DATA,
  ROUTES,
  THEMES,
  WRECKS,
  BIRD_FLOCKS,
  ISLAND_WALKERS,
  CAT,
  FOAM,
  ACCEL,
  FRIC,
  MSPD,
  IDIST,
  TRAIL_LEN,
  type Isle,
  type Pt,
  type CS,
  type SS,
} from "./game-data";

export interface GameLoopRefs {
  shipRef: React.MutableRefObject<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    ang: number;
    spd: number;
    ready: boolean;
  }>;
  keysRef: React.MutableRefObject<Record<string, boolean>>;
  wakeRef: React.MutableRefObject<
    { wx: number; wy: number; age: number; ma: number }[]
  >;
  trailRef: React.MutableRefObject<Pt[]>;
  tickRef: React.MutableRefObject<number>;
  animRef: React.MutableRefObject<number>;
  islesRef: React.MutableRefObject<Isle[]>;
  nearRef: React.MutableRefObject<Isle | null>;
  whalesRef: React.MutableRefObject<CS[]>;
  turtlesRef: React.MutableRefObject<CS[]>;
  serpRef: React.MutableRefObject<SS>;
  creatureInitRef: React.MutableRefObject<boolean>;
  gameStartRef: React.MutableRefObject<number>;
  skipNextSplashRef: React.MutableRefObject<boolean>;
  setScreen: React.Dispatch<React.SetStateAction<"loading" | "splash" | "game">>;
}

export interface GameLoopState {
  setNear: React.Dispatch<React.SetStateAction<string | null>>;
  router: ReturnType<typeof useRouter>;
}

export function useGameLoop(
  cvsRef: RefObject<HTMLCanvasElement>,
  refs: GameLoopRefs,
  state: GameLoopState,
  isActive: boolean
) {
  const { setNear, router } = state;
  const {
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
  } = refs;

  useEffect(() => {
    if (!isActive) return;

    const canvas = cvsRef.current!;
    const ctx = canvas.getContext("2d")!;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (!shipRef.current.ready) {
        shipRef.current.x = canvas.width * 0.5;
        shipRef.current.y = canvas.height * 0.68;
        shipRef.current.ready = true;
      }
      if (!creatureInitRef.current) {
        creatureInitRef.current = true;
        const W = canvas.width,
          H = canvas.height;
        whalesRef.current = [
          { x: W * 0.12, y: H * 0.18, vx: 1.1, vy: 0.2, ang: 0 },
          { x: W * 0.82, y: H * 0.25, vx: -1.0, vy: 0.18, ang: Math.PI },
          { x: W * 0.18, y: H * 0.72, vx: 0.9, vy: -0.22, ang: 0 },
          { x: W * 0.75, y: H * 0.78, vx: -0.85, vy: -0.18, ang: Math.PI },
        ];
        turtlesRef.current = Array.from({ length: 5 }, (_, i) => ({
          x: W * (0.12 + i * 0.19),
          y: H * (0.18 + (i % 2) * 0.45),
          vx: i % 2 === 0 ? 0.4 : -0.38,
          vy: Math.sin(i * 1.3) * 0.14,
          ang: i % 2 === 0 ? 0 : Math.PI,
        }));
        serpRef.current = {
          x: W * 0.32,
          y: H * 0.55,
          vx: 0.65,
          vy: 0.1,
          ang: 0,
          trail: [],
        };
      }
    }
    resize();
    window.addEventListener("resize", resize);

    const goHomeFromGame = () => {
      skipNextSplashRef.current = true;
      setScreen("splash");
    };

    const visitIsland = (id: string) => {
      if (id === "home") {
        goHomeFromGame();
        return;
      }
      window.sessionStorage.setItem("skipHomePosterEnter", "1");
      router.push(ROUTES[id]);
    };

    const kd = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        e.preventDefault();
      keysRef.current[e.key] = true;
      if ((e.key === "e" || e.key === "E") && nearRef.current)
        visitIsland(nearRef.current.id);
    };
    const ku = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);

    function onClick(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect(),
        cx = e.clientX - rect.left,
        cy = e.clientY - rect.top;
      for (const isle of islesRef.current) {
        if (Math.hypot(cx - isle.x, cy - isle.y) < isle.r * 0.85) {
          visitIsland(isle.id);
          return;
        }
      }
    }
    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect(),
        mx = e.clientX - rect.left,
        my = e.clientY - rect.top;
      canvas.style.cursor = islesRef.current.some(
        (i) => Math.hypot(mx - i.x, my - i.y) < i.r * 0.85,
      )
        ? "pointer"
        : "default";
    }
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("mousemove", onMove);

    // ═══════════════════════════════════════════════════════════════
    // DRAWING FUNCTIONS - COMPLETE
    // ═══════════════════════════════════════════════════════════════

    function steer(s: CS, maxSpd: number, isles: Isle[], W: number, H: number) {
      isles.forEach((isle) => {
        const dx = s.x - isle.x,
          dy = s.y - isle.y;
        const dist = Math.hypot(dx, dy);
        const avoidR = isle.r * 1.9;
        if (dist < avoidR && dist > 1) {
          const f = Math.pow((avoidR - dist) / avoidR, 2) * maxSpd * 3;
          s.vx += (dx / dist) * f;
          s.vy += (dy / dist) * f * 0.55;
        }
      });
      if (s.x < -80) s.x = W + 80;
      else if (s.x > W + 80) s.x = -80;
      if (s.y < -80) s.y = H + 80;
      else if (s.y > H + 80) s.y = -80;
      const spd = Math.hypot(s.vx, s.vy);
      if (spd > maxSpd) {
        s.vx = (s.vx / spd) * maxSpd;
        s.vy = (s.vy / spd) * maxSpd;
      } else if (spd < maxSpd * 0.4 && spd > 0) {
        const b = maxSpd * 0.02;
        s.vx += (s.vx / spd) * b;
        s.vy += (s.vy / spd) * b;
      }
      if (spd > 0.05) s.ang = Math.atan2(s.vy, s.vx);
      s.x += s.vx;
      s.y += s.vy;
    }

    function drawOcean(W: number, H: number) {
      ctx.fillStyle = "#0b1d35";
      ctx.fillRect(0, 0, W, H);
      const dg = ctx.createRadialGradient(
        W / 2,
        H / 2,
        0,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.7,
      );
      dg.addColorStop(0, "rgba(10,40,80,0)");
      dg.addColorStop(1, "rgba(0,10,30,0.55)");
      ctx.fillStyle = dg;
      ctx.fillRect(0, 0, W, H);
      const rh = 52,
        nr = Math.ceil(H / rh) + 2;
      for (let r = -1; r < nr; r++) {
        const sy = r * rh,
          ph = tickRef.current * 0.008 + r * 0.9;
        ctx.beginPath();
        for (let x = -20; x < W + 20; x += 5) {
          const y =
            sy +
            9 * Math.sin(x * 0.014 + ph) +
            4 * Math.sin(x * 0.023 - ph * 1.2);
          x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(90,170,240,${Math.max(0, 0.038 + 0.025 * Math.sin(r * 2.3 + tickRef.current * 0.009))})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      FOAM.forEach((f) => {
        const sx = f.pX * W,
          sy = f.pY * H,
          a = Math.max(0, Math.sin(tickRef.current * 0.04 + f.ph)) * 0.28;
        if (a < 0.03) return;
        ctx.beginPath();
        ctx.arc(sx, sy, f.sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190,225,255,${a})`;
        ctx.fill();
      });
    }

    function drawTrail() {
      const trail = trailRef.current;
      if (trail.length < 2) return;
      for (let i = 1; i < trail.length; i++) {
        if (i % 3 !== 0) continue;
        const life = i / trail.length;
        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140,200,255,${life * 0.3})`;
        ctx.fill();
      }
    }

    function getTide() {
      return 0.5 + 0.5 * Math.sin(tickRef.current * 0.003);
    }

    function drawWrecks(W: number, H: number) {
      WRECKS.forEach((wr, i) => {
        const wx = wr.pX * W,
          wy = wr.pY * H;
        if (
          islesRef.current.some(
            (isle) => Math.hypot(wx - isle.x, wy - isle.y) < isle.r * 1.4,
          )
        )
          return;
        ctx.save();
        ctx.translate(wx, wy);
        ctx.rotate(wr.rot);
        ctx.globalAlpha = 0.52;
        const s = wr.sz;
        ctx.beginPath();
        ctx.moveTo(-28 * s, 2 * s);
        ctx.bezierCurveTo(-28 * s, 13 * s, 28 * s, 13 * s, 28 * s, 2 * s);
        ctx.closePath();
        ctx.fillStyle = "#3a1e06";
        ctx.fill();
        ctx.strokeStyle = "#1e0e02";
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-4 * s, 2 * s);
        ctx.lineTo(-9 * s, -20 * s);
        ctx.strokeStyle = "#5a2e08";
        ctx.lineWidth = 3 * s;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-9 * s, -20 * s);
        ctx.lineTo(10 * s, -11 * s);
        ctx.strokeStyle = "#5a2e08";
        ctx.lineWidth = 2 * s;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-9 * s, -20 * s);
        ctx.lineTo(14 * s, 2 * s);
        ctx.strokeStyle = "rgba(80,40,10,0.35)";
        ctx.lineWidth = 1;
        ctx.stroke();
        for (let b = 0; b < 6; b++) {
          ctx.beginPath();
          ctx.arc((-20 + b * 8) * s, 9 * s, 2 * s, 0, Math.PI * 2);
          ctx.fillStyle = "#6a6840";
          ctx.fill();
        }
        for (let sw = 0; sw < 3; sw++) {
          ctx.beginPath();
          ctx.moveTo((-10 + sw * 10) * s, 5 * s);
          for (let p = 0; p < 5; p++)
            ctx.lineTo(
              (-10 + sw * 10) * s +
                Math.sin(tickRef.current * 0.015 + p + sw + i) * 5 * s,
              (5 + p * 5) * s,
            );
          ctx.strokeStyle = "rgba(30,160,60,0.4)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.restore();
      });
    }

    function drawTidepools(isle: Isle) {
      const { x, y, r } = isle;
      const tick = tickRef.current;
      const tide = getTide();
      for (let rk = 0; rk < 12; rk++) {
        const rka = (rk / 12) * Math.PI * 2,
          rkr = r * (0.88 + Math.sin(rk * 2.1) * 0.07);
        const rkx = x + Math.cos(rka) * rkr,
          rky = y + Math.sin(rka) * rkr * 0.62;
        const rsz = r * (0.065 + Math.sin(rk * 1.5) * 0.025);
        ctx.beginPath();
        ctx.ellipse(rkx, rky, rsz, rsz * 0.6, rka, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(70,60,50,0.65)";
        ctx.fill();
        ctx.strokeStyle = "rgba(50,42,35,0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();
        const pvis = Math.max(0, Math.min(1, tide * 2 - 0.3));
        ctx.beginPath();
        ctx.ellipse(rkx, rky, rsz * 0.68, rsz * 0.42, rka, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(30,110,180,${pvis * 0.6})`;
        ctx.fill();
        if (pvis > 0.4 && Math.sin(tick * 0.06 + rk) > 0.2) {
          ctx.beginPath();
          ctx.arc(rkx + rsz * 0.1, rky - rsz * 0.1, rsz * 0.12, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(160,220,255,${pvis * 0.45})`;
          ctx.fill();
        }
        if (rk % 3 === 0 && pvis > 0.3) {
          ctx.save();
          ctx.translate(rkx, rky);
          ctx.rotate(rka + tick * 0.002);
          ctx.globalAlpha = pvis * 0.8;
          for (let arm = 0; arm < 5; arm++) {
            const aa = (arm / 5) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(aa) * rsz * 0.42, Math.sin(aa) * rsz * 0.26);
            ctx.strokeStyle = "#dd4828";
            ctx.lineWidth = 2.2;
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(0, 0, rsz * 0.11, 0, Math.PI * 2);
          ctx.fillStyle = "#dd4828";
          ctx.fill();
          ctx.restore();
        }
        if (rk % 4 === 1 && pvis > 0.4) {
          ctx.save();
          ctx.translate(rkx - rsz * 0.2, rky);
          ctx.globalAlpha = pvis * 0.7;
          for (let t = 0; t < 9; t++) {
            const ta = (t / 9) * Math.PI * 2 + Math.sin(tick * 0.025) * 0.35;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(ta) * rsz * 0.38, Math.sin(ta) * rsz * 0.24);
            ctx.strokeStyle = "#a828c8";
            ctx.lineWidth = 1.6;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(
              Math.cos(ta) * rsz * 0.38,
              Math.sin(ta) * rsz * 0.24,
              rsz * 0.07,
              0,
              Math.PI * 2,
            );
            ctx.fillStyle = "#c840e8";
            ctx.fill();
          }
          ctx.restore();
        }
        if (rk % 5 === 2 && pvis > 0.3) {
          const cx2 = rkx + rsz * 0.15,
            cy2 = rky + rsz * 0.05;
          ctx.save();
          ctx.translate(cx2, cy2);
          ctx.rotate(tick * 0.01 + rk);
          ctx.globalAlpha = pvis * 0.75;
          ctx.beginPath();
          ctx.ellipse(0, 0, rsz * 0.22, rsz * 0.16, 0, 0, Math.PI * 2);
          ctx.fillStyle = "#c85828";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(rsz * 0.2, 0, rsz * 0.12, 0, Math.PI * 2);
          ctx.fillStyle = "#e07840";
          ctx.fill();
          ctx.restore();
        }
      }
      ctx.beginPath();
      ctx.ellipse(x, y, r * 0.94, r * 0.585, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(200,230,255,${0.12 + tide * 0.22})`;
      ctx.lineWidth = 3.5;
      ctx.setLineDash([5, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    function drawBirds(W: number, H: number) {
      const tick = tickRef.current;
      BIRD_FLOCKS.forEach((flock, fi) => {
        const bx =
          (((flock.pX + tick * flock.speed * flock.dir) % 1.3) - 0.15) * W;
        const by =
          (flock.pY + Math.sin(tick * 0.007 + flock.phase) * 0.038) * H;
        for (let b = 0; b < flock.count; b++) {
          const ox = b * (flock.dir * 24) - flock.count * 12,
            oy = Math.abs(b - flock.count / 2) * 8 + Math.sin(b * 0.9) * 3;
          const wing = Math.sin(tick * 0.19 + b * 0.55 + flock.phase) * 0.5;
          ctx.save();
          ctx.translate(bx + ox, by + oy);
          if (flock.dir < 0) ctx.scale(-1, 1);
          ctx.globalAlpha = 0.52;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-7, -4 - wing * 9, -12, -2 + wing * 4);
          ctx.strokeStyle = "rgba(70,70,95,0.85)";
          ctx.lineWidth = 1.6;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(7, -4 - wing * 9, 12, -2 + wing * 4);
          ctx.strokeStyle = "rgba(70,70,95,0.85)";
          ctx.lineWidth = 1.6;
          ctx.stroke();
          ctx.restore();
        }
      });
    }

    function drawWalker(
      wx: number,
      wy: number,
      facing: number,
      tick: number,
      shirt: string,
      pants: string,
    ) {
      ctx.save();
      ctx.translate(wx, wy);
      if (facing < 0) ctx.scale(-1, 1);
      const legSwing = Math.sin(tick * 0.15) * 0.35;
      ctx.beginPath();
      ctx.ellipse(0, 14, 7, 3, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fill();
      ctx.strokeStyle = pants;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-1, 6);
      ctx.lineTo(-4 + legSwing * 6, 14);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(1, 6);
      ctx.lineTo(4 - legSwing * 6, 14);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(-4 + legSwing * 6, 15, 3, 1.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#1a1a1a";
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(4 - legSwing * 6, 15, 3, 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.rect(-4, -4, 8, 10);
      ctx.fillStyle = shirt;
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.strokeStyle = shirt;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(-9, -legSwing * 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(4, 0);
      ctx.lineTo(9, legSwing * 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-9, -legSwing * 5, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#f0c89a";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(9, legSwing * 5, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -8, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#f0c89a";
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(2, -9, 0.9, 0, Math.PI * 2);
      ctx.fillStyle = "#333";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -12, 5, Math.PI, 0);
      ctx.fillStyle = "#3a2010";
      ctx.fill();
      ctx.restore();
    }

    function drawCat(isle: Isle, tick: number) {
      const angle = CAT.angle + tick * CAT.speed;
      const cx2 = isle.x + Math.cos(angle) * isle.r * 0.38;
      const cy2 = isle.y + Math.sin(angle) * isle.r * 0.24;
      const facing = Math.cos(angle + 0.01) > Math.cos(angle) ? 1 : -1;
      const sitting = Math.sin(tick * 0.04) > 0.6;
      ctx.save();
      ctx.translate(cx2, cy2);
      if (facing < 0) ctx.scale(-1, 1);
      ctx.beginPath();
      ctx.ellipse(0, sitting ? 6 : 8, 8, 3, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fill();
      if (sitting) {
        ctx.beginPath();
        ctx.ellipse(0, 2, 7, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#888";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -7, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#999";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-5, -11);
        ctx.lineTo(-3, -16);
        ctx.lineTo(0, -12);
        ctx.fillStyle = "#888";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(5, -11);
        ctx.lineTo(3, -16);
        ctx.lineTo(0, -12);
        ctx.fillStyle = "#888";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-4, -12);
        ctx.lineTo(-3, -15);
        ctx.lineTo(-1, -12);
        ctx.fillStyle = "#ffaaaa";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(4, -12);
        ctx.lineTo(3, -15);
        ctx.lineTo(1, -12);
        ctx.fillStyle = "#ffaaaa";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-2, -7, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "#222";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(2, -7, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "#222";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-1.5, -6.5, 0.5, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(2.5, -6.5, 0.5, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -5, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffaaaa";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(-2, -4);
        ctx.lineTo(-9, -5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-2, -4);
        ctx.lineTo(-9, -3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(2, -4);
        ctx.lineTo(9, -5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(2, -4);
        ctx.lineTo(9, -3);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(8, 4, 6, Math.PI * 0.5, Math.PI * 1.8);
        ctx.strokeStyle = "#888";
        ctx.lineWidth = 3;
        ctx.stroke();
      } else {
        const legA = Math.sin(tick * 0.18) * 0.4;
        ctx.beginPath();
        ctx.ellipse(2, 2, 9, 5, 0.15, 0, Math.PI * 2);
        ctx.fillStyle = "#888";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(10, -1, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#999";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(7, -5);
        ctx.lineTo(8, -9);
        ctx.lineTo(10, -5);
        ctx.fillStyle = "#888";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(12, -5);
        ctx.lineTo(13, -9);
        ctx.lineTo(15, -5);
        ctx.fillStyle = "#888";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(12, -1, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "#222";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(12.5, -1.5, 0.5, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(15, 0, 1, 0, Math.PI * 2);
        ctx.fillStyle = "#ffaaaa";
        ctx.fill();
        ctx.strokeStyle = "#777";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-2, 5);
        ctx.lineTo(-3 + legA * 5, 12);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(2, 5);
        ctx.lineTo(3 - legA * 5, 12);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(6, 5);
        ctx.lineTo(5 + legA * 5, 12);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(9, 5);
        ctx.lineTo(10 - legA * 5, 12);
        ctx.stroke();
        const tailWag = Math.sin(tick * 0.12) * 15;
        ctx.beginPath();
        ctx.moveTo(-7, 2);
        ctx.quadraticCurveTo(-15 + tailWag, -5, -12 + tailWag, -12);
        ctx.strokeStyle = "#888";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawWhale(s: CS, tick: number) {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.ang);
      ctx.beginPath();
      ctx.ellipse(0, 0, 46, 18, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#3a5a72";
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(8, 5, 30, 11, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200,218,230,0.45)";
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-8, 8);
      ctx.lineTo(-22, 22);
      ctx.lineTo(-4, 16);
      ctx.fillStyle = "#2a4a60";
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(5, -18);
      ctx.lineTo(-4, -10);
      ctx.lineTo(10, -6);
      ctx.closePath();
      ctx.fillStyle = "#2a4a60";
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-46, 0);
      ctx.lineTo(-58, -13);
      ctx.lineTo(-52, 0);
      ctx.lineTo(-58, 13);
      ctx.closePath();
      ctx.fillStyle = "#2a4a60";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(28, -4, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#111";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(29, -5, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      if (Math.sin(tick * 0.008 + s.x * 0.001) > 0.7) {
        const sa = (Math.sin(tick * 0.008 + s.x * 0.001) - 0.7) / 0.3;
        for (let sp = 0; sp < 5; sp++) {
          ctx.beginPath();
          ctx.moveTo(15, -18);
          ctx.lineTo(15 + Math.sin(sp * 1.2) * 9 * sa, -18 - sp * 15 * sa);
          ctx.strokeStyle = `rgba(200,240,255,${sa * 0.65})`;
          ctx.lineWidth = 2.2;
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    function drawTurtle(s: CS, tick: number) {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.ang);
      ctx.beginPath();
      ctx.ellipse(0, 0, 13, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#3a7a30";
      ctx.fill();
      ctx.strokeStyle = "#1a5010";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      for (let sc = 0; sc < 4; sc++) {
        const sa = (sc / 4) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(sa) * 6, Math.sin(sa) * 4.5, 3.5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,0,0,0.18)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,0,0,0.18)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(17, 0, 6, 4.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#4a8a38";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(20, -2.5, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = "#111";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(21, -3, 0.7, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(20, 2.5, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = "#111";
      ctx.fill();
      const fa = Math.sin(tick * 0.08 + s.x * 0.002) * 0.6;
      [
        [8, 12, fa],
        [8, -12, -fa],
        [-6, 11, -fa],
        [-6, -11, fa],
      ].forEach(([fx, fy, fa2]) => {
        ctx.beginPath();
        ctx.moveTo(fx as number, fy as number);
        ctx.lineTo(
          (fx as number) + 16 * Math.cos(fa2 as number),
          (fy as number) + 16 * Math.sin(fa2 as number),
        );
        ctx.lineTo((fx as number) + 8, fy as number);
        ctx.fillStyle = "#3a7a30";
        ctx.fill();
      });
      ctx.beginPath();
      ctx.ellipse(-15, 0, 4, 2.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#2a6020";
      ctx.fill();
      ctx.restore();
    }

    function updateSerpent(W: number, H: number) {
      const s = serpRef.current;
      steer(s, 0.65, islesRef.current, W, H);
      s.trail.unshift({ x: s.x, y: s.y });
      if (s.trail.length > 120) s.trail.pop();
    }

    function drawSerpent() {
      const s = serpRef.current,
        trail = s.trail;
      if (trail.length < 20) return;
      const tick = tickRef.current;
      for (let seg = 2; seg < Math.min(trail.length - 1, 100); seg += 2) {
        if (seg % 4 !== 0) continue;
        const pt = trail[seg];
        const life = 1 - seg / 100;
        const segR = 10 * life;
        if (seg % 8 === 0) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, segR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(28,80,35,${life * 0.85})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(15,55,20,${life * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, segR * 0.55, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0,0,0,0.12)`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.ang);
      ctx.beginPath();
      ctx.ellipse(0, 0, 13, 9, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#1e6028";
      ctx.fill();
      ctx.strokeStyle = "#0e3a18";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-5, -4, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = "#ffee00";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-4.5, -4, 1.1, 0, Math.PI * 2);
      ctx.fillStyle = "#111";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-5, 4, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = "#ffee00";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-4.5, 4, 1.1, 0, Math.PI * 2);
      ctx.fillStyle = "#111";
      ctx.fill();
      if (Math.sin(tick * 0.06) > 0.4) {
        ctx.beginPath();
        ctx.moveTo(13, 0);
        ctx.lineTo(20, -3);
        ctx.moveTo(13, 0);
        ctx.lineTo(20, 3);
        ctx.strokeStyle = "#ff3030";
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawIsle(isle:Isle){
      const{x,y,r,name,lbl,theme}=isle;
      const t=THEMES[theme];const tick=tickRef.current;const tide=getTide();

      // ── FIXED: ZOOM ANIMATION REMOVED ──
      // Dynamic scaling down/up timeline replaced with flat execution matrix
      ctx.save();
      // Retained global alpha fading logic but removed the item scale translation properties
      const elapsed=(Date.now()-gameStartRef.current)/1000;
      const isleIndex=ISLE_DATA.findIndex(d=>d.id===isle.id);
      const delay=isleIndex*0.18;
      const animT=Math.max(0,Math.min(1,(elapsed-delay)/0.7));
      const ease=1-Math.pow(1-animT,3);
      if(ease<0.01) return;
      ctx.globalAlpha=ease;

      drawTidepools(isle);

      const tideOff=tide*r*0.045;
      ctx.save();ctx.shadowColor='rgba(0,0,0,0.55)';ctx.shadowBlur=28;ctx.shadowOffsetX=7;ctx.shadowOffsetY=10;
      ctx.beginPath();ctx.ellipse(x,y,r,r*0.62-tideOff*0.1,0,0,Math.PI*2);ctx.fillStyle=t.sand;ctx.fill();ctx.restore();
      const sg2=ctx.createRadialGradient(x-r*0.2,y-r*0.15,r*0.1,x,y,r);sg2.addColorStop(0,'rgba(255,255,255,0.1)');sg2.addColorStop(1,'rgba(0,0,0,0.22)');
      ctx.beginPath();ctx.ellipse(x,y,r,r*0.62-tideOff*0.1,0,0,Math.PI*2);ctx.fillStyle=sg2;ctx.fill();

      ctx.beginPath();ctx.ellipse(x,y,r,r*0.62,0,0,Math.PI*2);ctx.fillStyle=t.top;ctx.fill();
      const tg2=ctx.createRadialGradient(x-r*0.15,y-r*0.2,r*0.05,x,y,r);tg2.addColorStop(0,'rgba(255,255,255,0.1)');tg2.addColorStop(1,'rgba(0,0,0,0.18)');
      ctx.beginPath();ctx.ellipse(x,y,r,r*0.62,0,0,Math.PI*2);ctx.fillStyle=tg2;ctx.fill();

      const isleWalkers=ISLAND_WALKERS[isle.id];
      if(isleWalkers){
        isleWalkers.forEach((w,wi)=>{
          const angle=w.angle+tick*w.speed*w.side;
          const wx2=x+Math.cos(angle)*r*0.76;
          const wy2=y+Math.sin(angle)*r*0.47;
          const facing=w.side*Math.cos(angle)>0?1:-1;
          drawWalker(wx2,wy2,facing,tick+wi*20,w.shirt,w.pants);
        });
      }
      if(isle.id==='home') drawCat(isle,tick);

      if(theme==='emerald'){
        ctx.beginPath();ctx.ellipse(x,y+r*0.08,r*0.62,r*0.38,0,0,Math.PI*2);ctx.fillStyle='rgba(50,160,50,0.35)';ctx.fill();
        for(let sp=0;sp<7;sp++){
          const spx=x-r*0.02+Math.sin(sp*0.8)*r*0.04,spy=y+r*0.18+sp*r*0.06;
          ctx.beginPath();ctx.ellipse(spx,spy,r*0.04,r*0.025,sp*0.4,0,Math.PI*2);ctx.fillStyle=`rgba(180,160,120,${0.55-sp*0.04})`;ctx.fill();
          ctx.strokeStyle='rgba(140,120,90,0.3)';ctx.lineWidth=0.8;ctx.stroke();
        }
        ctx.beginPath();ctx.rect(x-r*0.38,y-r*0.22,r*0.76,r*0.4);ctx.fillStyle='#b8a080';ctx.fill();
        ctx.strokeStyle='#8a7050';ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();ctx.rect(x-r*0.36,y-r*0.42,r*0.72,r*0.42);
        const hbg=ctx.createLinearGradient(x,y-r*0.42,x,y);hbg.addColorStop(0,'#f5e8c0');hbg.addColorStop(1,'#e8d4a0');
        ctx.fillStyle=hbg;ctx.fill();ctx.strokeStyle='#c8a860';ctx.lineWidth=1.5;ctx.stroke();
        for(let sd=0;sd<7;sd++){ctx.beginPath();ctx.moveTo(x-r*0.36,y-r*0.37+sd*r*0.06);ctx.lineTo(x+r*0.36,y-r*0.37+sd*r*0.06);ctx.strokeStyle='rgba(0,0,0,0.06)';ctx.lineWidth=1;ctx.stroke();}
        ctx.beginPath();ctx.moveTo(x-r*0.42,y-r*0.42);ctx.lineTo(x,y-r*0.75);ctx.lineTo(x+r*0.42,y-r*0.42);ctx.closePath();
        const rfg=ctx.createLinearGradient(x,y-r*0.75,x,y-r*0.42);rfg.addColorStop(0,'#8a2010');rfg.addColorStop(1,'#c03820');ctx.fillStyle=rfg;ctx.fill();ctx.strokeStyle='#7a1a08';ctx.lineWidth=1.5;ctx.stroke();
        for(let row=0;row<5;row++){
          const ry=y-r*0.42-row*r*0.067;const rw=r*0.42*(1-row/5)*1.02;
          for(let sh=0;sh<Math.floor(row*2+3);sh++){
            const sw=rw*2/(row*2+3);const sx2=x-rw+sh*sw;
            ctx.beginPath();ctx.rect(sx2+1,ry-r*0.067,sw-2,r*0.067);ctx.strokeStyle='rgba(0,0,0,0.1)';ctx.lineWidth=0.5;ctx.stroke();
          }
        }
        ctx.beginPath();ctx.moveTo(x-r*0.44,y-r*0.42);ctx.lineTo(x+r*0.44,y-r*0.42);ctx.strokeStyle='#f0e8d0';ctx.lineWidth=4;ctx.stroke();
        ctx.beginPath();ctx.rect(x-r*0.36,y-r*0.32,r*0.22,r*0.32);ctx.fillStyle='#eedca8';ctx.fill();ctx.strokeStyle='#c8a860';ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x-r*0.38,y-r*0.32);ctx.lineTo(x-r*0.25,y-r*0.48);ctx.lineTo(x-r*0.12,y-r*0.32);ctx.closePath();ctx.fillStyle='#a02818';ctx.fill();ctx.strokeStyle='#7a1a08';ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.rect(x-r*0.14,y-r*0.82,r*0.1,r*0.42);
        const chg=ctx.createLinearGradient(x-r*0.14,0,x-r*0.04,0);chg.addColorStop(0,'#8a4828');chg.addColorStop(1,'#a05838');ctx.fillStyle=chg;ctx.fill();ctx.strokeStyle='#6a3018';ctx.lineWidth=1.2;ctx.stroke();
        ctx.beginPath();ctx.rect(x-r*0.16,y-r*0.84,r*0.14,r*0.03);ctx.fillStyle='#6a3018';ctx.fill();
        for(let cm=0;cm<4;cm++){ctx.beginPath();ctx.moveTo(x-r*0.14,y-r*0.74+cm*r*0.08);ctx.lineTo(x-r*0.04,y-r*0.74+cm*r*0.08);ctx.strokeStyle='rgba(0,0,0,0.12)';ctx.lineWidth=1;ctx.stroke();}
        for(let sm=0;sm<4;sm++){
          const sa=((tick*0.012+sm*0.25)%1);
          const smx=x-r*0.09+Math.sin(tick*0.04+sm*1.2)*r*0.05;
          const smy=y-r*0.84-sa*r*0.28;
          ctx.beginPath();ctx.arc(smx,smy,r*(0.025+sa*0.04),0,Math.PI*2);
          ctx.fillStyle=`rgba(200,195,190,${0.35*(1-sa)})`;ctx.fill();
        }
        ctx.beginPath();ctx.rect(x-r*0.18,y-r*0.04,r*0.36,r*0.22);ctx.fillStyle='#e8dcc0';ctx.fill();ctx.strokeStyle='#c8aa70';ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x-r*0.22,y-r*0.04);ctx.lineTo(x,y-r*0.16);ctx.lineTo(x+r*0.22,y-r*0.04);ctx.closePath();ctx.fillStyle='#b03020';ctx.fill();ctx.strokeStyle='#8a1e10';ctx.lineWidth=1;ctx.stroke();
        for(let pc=0;pc<3;pc++){
          const pcx=x-r*0.16+pc*r*0.16;
          ctx.beginPath();ctx.rect(pcx-r*0.025,y-r*0.04,r*0.05,r*0.22);
          const pcg=ctx.createLinearGradient(pcx-r*0.025,0,pcx+r*0.025,0);pcg.addColorStop(0,'#f5f0e0');pcg.addColorStop(0.5,'#e8e0c8');pcg.addColorStop(1,'#f0ead8');ctx.fillStyle=pcg;ctx.fill();ctx.strokeStyle='#c8a860';ctx.lineWidth=0.8;ctx.stroke();
        }
        for(let pb=0;pb<5;pb++){ctx.beginPath();ctx.moveTo(x-r*0.18,y+r*0.04+pb*r*0.03);ctx.lineTo(x+r*0.18,y+r*0.04+pb*r*0.03);ctx.strokeStyle='rgba(0,0,0,0.06)';ctx.lineWidth=0.8;ctx.stroke();}
        for(let ps=0;ps<3;ps++){ctx.beginPath();ctx.rect(x-r*(0.12-ps*0.02),y+r*0.18+ps*r*0.025,r*(0.24-ps*0.04),r*0.025);ctx.fillStyle=`rgba(200,180,130,${0.8-ps*0.15})`;ctx.fill();}
        ctx.beginPath();ctx.rect(x-r*0.07,y-r*0.04,r*0.14,r*0.22);ctx.fillStyle='#5a1808';ctx.fill();
        ctx.beginPath();ctx.arc(x,y-r*0.04,r*0.07,Math.PI,0);ctx.fillStyle='#5a1808';ctx.fill();
        ctx.strokeStyle='#c8a050';ctx.lineWidth=2;ctx.stroke();
        ctx.beginPath();ctx.rect(x-r*0.06,y-r*0.03,r*0.05,r*0.08);ctx.strokeStyle='rgba(200,160,60,0.4)';ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.rect(x+r*0.01,y-r*0.03,r*0.05,r*0.08);ctx.strokeStyle='rgba(200,160,60,0.4)';ctx.lineWidth=1;ctx.stroke();
        ctx.save();ctx.shadowColor='#ffd060';ctx.shadowBlur=4;ctx.beginPath();ctx.arc(x+r*0.06,y+r*0.06,r*0.018,0,Math.PI*2);ctx.fillStyle='#d4a020';ctx.fill();ctx.restore();
        ctx.beginPath();ctx.arc(x,y-r*0.04,r*0.04,0,Math.PI*2);ctx.strokeStyle='#2a8a20';ctx.lineWidth=3;ctx.stroke();
        ctx.beginPath();ctx.arc(x,y-r*0.04,r*0.04,0,Math.PI*2);ctx.strokeStyle='rgba(200,40,20,0.6)';ctx.lineWidth=1.5;ctx.setLineDash([2,4]);ctx.stroke();ctx.setLineDash([]);
        ctx.beginPath();ctx.rect(x+r*0.1,y-r*0.36,r*0.22,r*0.2);ctx.fillStyle='rgba(180,220,255,0.55)';ctx.fill();ctx.strokeStyle='#c8a860';ctx.lineWidth=2;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x+r*0.21,y-r*0.36);ctx.lineTo(x+r*0.21,y-r*0.16);ctx.strokeStyle='#c8a860';ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x+r*0.1,y-r*0.26);ctx.lineTo(x+r*0.32,y-r*0.26);ctx.strokeStyle='#c8a860';ctx.lineWidth=1;ctx.stroke();
        const wglow=Math.sin(tick*0.025)>0;
        ctx.save();ctx.shadowColor='#ffe880';ctx.shadowBlur=wglow?14:6;
        ctx.beginPath();ctx.rect(x+r*0.11,y-r*0.35,r*0.2,r*0.18);ctx.fillStyle=`rgba(255,240,150,${wglow?0.35:0.2})`;ctx.fill();ctx.restore();
        ctx.beginPath();ctx.rect(x+r*0.08,y-r*0.16,r*0.26,r*0.04);ctx.fillStyle='#8a5028';ctx.fill();
        for(let wf=0;wf<6;wf++){ctx.beginPath();ctx.arc(x+r*0.11+wf*r*0.04,y-r*0.18+Math.sin(tick*0.04+wf)*r*0.008,r*0.02,0,Math.PI*2);ctx.fillStyle=['#ff6080','#ff9020','#ff4060','#ff8040','#e040e0','#ff6040'][wf];ctx.fill();}
        ctx.beginPath();ctx.rect(x-r*0.32,y-r*0.36,r*0.16,r*0.14);ctx.fillStyle='rgba(180,220,255,0.5)';ctx.fill();ctx.strokeStyle='#c8a860';ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x-r*0.24,y-r*0.36);ctx.lineTo(x-r*0.24,y-r*0.22);ctx.moveTo(x-r*0.32,y-r*0.29);ctx.lineTo(x-r*0.16,y-r*0.29);ctx.strokeStyle='#c8a860';ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.rect(x-r*0.32,y-r*0.36,r*0.04,r*0.14);ctx.fillStyle='rgba(220,160,140,0.5)';ctx.fill();
        ctx.beginPath();ctx.rect(x-r*0.2,y-r*0.36,r*0.04,r*0.14);ctx.fillStyle='rgba(220,160,140,0.5)';ctx.fill();
        ctx.beginPath();ctx.rect(x+r*0.05,y-r*0.65,r*0.14,r*0.1);ctx.fillStyle='rgba(180,220,255,0.45)';ctx.fill();ctx.strokeStyle='#c8a860';ctx.lineWidth=1.2;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x+r*0.03,y-r*0.65);ctx.lineTo(x+r*0.12,y-r*0.73);ctx.lineTo(x+r*0.21,y-r*0.65);ctx.closePath();ctx.fillStyle='#b03020';ctx.fill();
        ctx.beginPath();ctx.ellipse(x-r*0.42,y+r*0.05,r*0.12,r*0.08,0,0,Math.PI*2);ctx.fillStyle='rgba(40,150,40,0.5)';ctx.fill();
        for(let gf=0;gf<8;gf++){
          const gfa=(gf/8)*Math.PI*2,gfr=r*0.08;
          const gfx=x-r*0.42+Math.cos(gfa)*gfr,gfy=y+r*0.05+Math.sin(gfa)*gfr*0.6;
          ctx.beginPath();ctx.arc(gfx,gfy,r*0.022,0,Math.PI*2);ctx.fillStyle=['#ff6080','#ff9020','#ffe040','#ff40a0','#c040ff','#40c0ff','#ff4040','#80ff40'][gf];ctx.fill();
          ctx.beginPath();ctx.moveTo(gfx,gfy);ctx.lineTo(gfx,gfy+r*0.04);ctx.strokeStyle='rgba(30,120,30,0.6)';ctx.lineWidth=1;ctx.stroke();
        }
        const treeSway=Math.sin(tick*0.02)*r*0.015;
        ctx.beginPath();ctx.moveTo(x+r*0.42,y+r*0.22);ctx.lineTo(x+r*0.42+treeSway*0.3,y-r*0.1);ctx.strokeStyle='#5a3010';ctx.lineWidth=r*0.04;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x+r*0.42+treeSway*0.2,y-r*0.0);ctx.lineTo(x+r*0.55+treeSway,y-r*0.12);ctx.strokeStyle='#5a3010';ctx.lineWidth=r*0.025;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x+r*0.42+treeSway*0.3,y-r*0.08);ctx.lineTo(x+r*0.3+treeSway,y-r*0.18);ctx.strokeStyle='#5a3010';ctx.lineWidth=r*0.02;ctx.stroke();
        for(let lc=0;lc<5;lc++){
          const lca=(lc/5)*Math.PI*2,lcr=r*(0.18+Math.sin(lc*1.4)*0.04);
          const lcx=x+r*0.42+Math.cos(lca)*lcr+treeSway,lcy=y-r*0.12+Math.sin(lca)*lcr*0.65;
          ctx.beginPath();ctx.arc(lcx,lcy,r*(0.1+Math.sin(lc*2.1)*0.03),0,Math.PI*2);
          ctx.fillStyle=`rgba(${30+lc*8},${130+lc*10},${20+lc*5},0.75)`;ctx.fill();
        }
        ctx.beginPath();ctx.rect(x+r*0.22,y+r*0.32,r*0.07,r*0.08);ctx.fillStyle='#c03820';ctx.fill();ctx.strokeStyle='#8a1e10';ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.ellipse(x+r*0.255,y+r*0.32,r*0.035,r*0.02,0,Math.PI,0);ctx.fillStyle='#c03820';ctx.fill();
        ctx.beginPath();ctx.rect(x+r*0.254,y+r*0.36,r*0.06,r*0.02);ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fill();
        ctx.beginPath();ctx.rect(x+r*0.24,y+r*0.38,r*0.03,r*0.08);ctx.fillStyle='#8a5020';ctx.fill();
        ctx.save();ctx.shadowColor='#ffe080';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(x,y-r*0.16,r*0.025,0,Math.PI*2);ctx.fillStyle='#ffe060';ctx.fill();ctx.restore();
        ctx.beginPath();ctx.rect(x-r*0.06,y+r*0.17,r*0.12,r*0.04);ctx.fillStyle='#8a3020';ctx.fill();ctx.strokeStyle='#6a2010';ctx.lineWidth=0.8;ctx.stroke();
        ctx.save();ctx.fillStyle='rgba(255,220,180,0.7)';ctx.font=`bold ${r*0.025}px serif`;ctx.textAlign='center';ctx.fillText('HOME',x,y+r*0.2);ctx.restore();
      } else if(theme=='storm'){
        ctx.beginPath();ctx.rect(x-r*0.46,y-r*0.46,r*0.92,r*0.42);
        const libg=ctx.createLinearGradient(x,y-r*0.46,x,y-r*0.04);libg.addColorStop(0,'#e8dca8');libg.addColorStop(1,'#c8b878');ctx.fillStyle=libg;ctx.fill();ctx.strokeStyle='#8a6820';ctx.lineWidth=1.5;ctx.stroke();
        for(let br=0;br<5;br++){ctx.beginPath();ctx.moveTo(x-r*0.46,y-r*0.38+br*r*0.07);ctx.lineTo(x+r*0.46,y-r*0.38+br*r*0.07);ctx.strokeStyle='rgba(0,0,0,0.07)';ctx.lineWidth=1;ctx.stroke();}
        for(let lp=0;lp<7;lp++){const lpx=x-r*0.4+lp*r*0.135;ctx.beginPath();ctx.rect(lpx-4,y-r*0.46,8,r*0.42);const pg=ctx.createLinearGradient(lpx-4,0,lpx+4,0);pg.addColorStop(0,'#efe088');pg.addColorStop(0.5,'#d8c870');pg.addColorStop(1,'#e8d880');ctx.fillStyle=pg;ctx.fill();ctx.strokeStyle='rgba(100,80,20,0.3)';ctx.lineWidth=0.8;ctx.stroke();}
        ctx.beginPath();ctx.moveTo(x-r*0.5,y-r*0.46);ctx.lineTo(x,y-r*0.68);ctx.lineTo(x+r*0.5,y-r*0.46);ctx.closePath();ctx.fillStyle='#e0d098';ctx.fill();ctx.strokeStyle='#8a6820';ctx.lineWidth=1.5;ctx.stroke();
        ctx.save();ctx.translate(x,y-r*0.56);ctx.scale(1,0.6);
        ctx.beginPath();ctx.arc(-r*0.08,0,r*0.06,0,Math.PI*2);ctx.fillStyle='rgba(160,130,60,0.4)';ctx.fill();
        ctx.beginPath();ctx.arc(r*0.08,0,r*0.06,0,Math.PI*2);ctx.fill();ctx.restore();
        ctx.save();ctx.fillStyle='#5a3810';ctx.font=`bold ${r*0.09}px Georgia,serif`;ctx.textAlign='center';ctx.shadowColor='rgba(0,0,0,0.3)';ctx.shadowBlur=3;ctx.fillText('LIBRARY',x,y-r*0.22);ctx.restore();
        ctx.beginPath();ctx.arc(x,y-r*0.58,r*0.07,0,Math.PI*2);ctx.fillStyle='#e8e0c8';ctx.fill();ctx.strokeStyle='#8a6820';ctx.lineWidth=1.5;ctx.stroke();
        const ch=tick*0.005;
        ctx.beginPath();ctx.moveTo(x,y-r*0.58);ctx.lineTo(x+Math.cos(ch)*r*0.04,y-r*0.58+Math.sin(ch)*r*0.04);ctx.strokeStyle='#333';ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x,y-r*0.58);ctx.lineTo(x+Math.cos(ch*12)*r*0.055,y-r*0.58+Math.sin(ch*12)*r*0.055);ctx.strokeStyle='#333';ctx.lineWidth=1;ctx.stroke();
        for(let ls=0;ls<3;ls++){ctx.beginPath();ctx.rect(x-r*(0.42-ls*0.04),y-r*0.04+ls*r*0.035,r*(0.84-ls*0.08),r*0.035);ctx.fillStyle=`rgba(210,190,110,${0.85-ls*0.1})`;ctx.fill();}
        ctx.beginPath();ctx.ellipse(x-r*0.3,y+r*0.2,r*0.22,r*0.16,0,0,Math.PI*2);ctx.fillStyle='rgba(80,130,40,0.4)';ctx.fill();
        for(let rb=0;rb<2;rb++){const rba=(rb/2)*Math.PI+0.5;ctx.beginPath();ctx.rect(x-r*0.3+Math.cos(rba)*r*0.14-r*0.03,y+r*0.2+Math.sin(rba)*r*0.1-r*0.01,r*0.06,r*0.025);ctx.fillStyle='#8a5018';ctx.fill();}
        ctx.beginPath();ctx.moveTo(x-r*0.3,y+r*0.24);ctx.lineTo(x-r*0.3,y+r*0.08);ctx.strokeStyle='#888';ctx.lineWidth=2;ctx.stroke();
        ctx.save();ctx.shadowColor='#ffe080';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(x-r*0.3,y+r*0.08,3,0,Math.PI*2);ctx.fillStyle='#ffe060';ctx.fill();ctx.restore();
        ctx.save();ctx.translate(x+r*0.3,y+r*0.1);ctx.rotate(-0.65);ctx.globalAlpha=0.85;
        ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-r*0.25);ctx.strokeStyle='#e8d890';ctx.lineWidth=2.5;ctx.stroke();
        ctx.beginPath();ctx.moveTo(0,-r*0.25);ctx.bezierCurveTo(-r*0.1,-r*0.3,-r*0.16,-r*0.2,0,-r*0.25);ctx.fillStyle='#f0e8c0';ctx.fill();
        ctx.beginPath();ctx.moveTo(0,-r*0.25);ctx.bezierCurveTo(r*0.1,-r*0.3,r*0.16,-r*0.2,0,-r*0.25);ctx.fillStyle='#e8e0b8';ctx.fill();
        ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-3,r*0.05);ctx.strokeStyle='#282828';ctx.lineWidth=2;ctx.stroke();
        ctx.restore();
        for(let bp=0;bp<5;bp++){ctx.beginPath();ctx.rect(x+r*0.18,y+r*0.1-bp*r*0.045,r*0.24,r*0.042);ctx.fillStyle=['#c03020','#2050c0','#208040','#a06020','#8020a0'][bp];ctx.fill();ctx.strokeStyle='rgba(0,0,0,0.2)';ctx.lineWidth=0.5;ctx.stroke();}
        for(let bp=0;bp<3;bp++){ctx.beginPath();ctx.rect(x+r*0.42,y+r*0.14-bp*r*0.045,r*0.16,r*0.042);ctx.fillStyle=['#20a0a0','#c06020','#4020c0'][bp];ctx.fill();ctx.strokeStyle='rgba(0,0,0,0.2)';ctx.lineWidth=0.5;ctx.stroke();}
        ctx.save();ctx.translate(x+r*0.05,y+r*0.15);ctx.rotate(-0.1);ctx.globalAlpha=0.9;
        ctx.beginPath();ctx.rect(-r*0.1,-r*0.065,r*0.2,r*0.075);ctx.fillStyle='#2050c0';ctx.fill();
        ctx.beginPath();ctx.moveTo(-r*0.1,-r*0.065);ctx.quadraticCurveTo(-r*0.15,-r*0.08,-r*0.1,-r*0.065);ctx.lineTo(-r*0.1,r*0.01);ctx.closePath();ctx.fillStyle='#f5f0e0';ctx.fill();
        ctx.beginPath();ctx.moveTo(r*0.1,-r*0.065);ctx.quadraticCurveTo(r*0.15,-r*0.08,r*0.1,-r*0.065);ctx.lineTo(r*0.1,r*0.01);ctx.closePath();ctx.fillStyle='#f0ebe0';ctx.fill();
        for(let ln=0;ln<4;ln++){ctx.beginPath();ctx.moveTo(-r*0.09,(ln-2)*r*0.015);ctx.lineTo(-r*0.01,(ln-2)*r*0.015);ctx.strokeStyle='rgba(80,60,40,0.35)';ctx.lineWidth=0.7;ctx.stroke();}
        for(let ln=0;ln<4;ln++){ctx.beginPath();ctx.moveTo(r*0.01,(ln-2)*r*0.015);ctx.lineTo(r*0.09,(ln-2)*r*0.015);ctx.strokeStyle='rgba(80,60,40,0.35)';ctx.lineWidth=0.7;ctx.stroke();}
        ctx.restore();
        ctx.beginPath();ctx.arc(x-r*0.42,y+r*0.12,r*0.06,0,Math.PI*2);ctx.strokeStyle='rgba(180,160,100,0.75)';ctx.lineWidth=3;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x-r*0.375,y+r*0.165);ctx.lineTo(x-r*0.32,y+r*0.21);ctx.strokeStyle='rgba(140,120,70,0.75)';ctx.lineWidth=4;ctx.stroke();
        ctx.beginPath();ctx.arc(x-r*0.42,y+r*0.12,r*0.055,0,Math.PI*2);ctx.fillStyle='rgba(180,220,255,0.12)';ctx.fill();
      } else if(theme==='golden'){
        ctx.beginPath();ctx.rect(x-r*0.48,y-r*0.44,r*0.96,r*0.4);
        const galg=ctx.createLinearGradient(x,y-r*0.44,x,y-r*0.04);galg.addColorStop(0,'#eee8f8');galg.addColorStop(1,'#ccc0e0');ctx.fillStyle=galg;ctx.fill();ctx.strokeStyle='#7060a0';ctx.lineWidth=1.5;ctx.stroke();
        for(let gw=0;gw<4;gw++){
          ctx.beginPath();ctx.rect(x-r*0.44+gw*r*0.24,y-r*0.4,r*0.2,r*0.28);ctx.fillStyle='rgba(180,210,255,0.35)';ctx.fill();ctx.strokeStyle='#9080b0';ctx.lineWidth=1;ctx.stroke();
          ctx.beginPath();ctx.rect(x-r*0.4+gw*r*0.24,y-r*0.36,r*0.12,r*0.18);ctx.fillStyle=['rgba(255,80,40,0.4)','rgba(40,80,255,0.4)','rgba(40,200,80,0.4)','rgba(255,200,0,0.4)'][gw];ctx.fill();
        }
        ctx.beginPath();ctx.rect(x-r*0.5,y-r*0.46,r*1.0,r*0.04);ctx.fillStyle='#8070b0';ctx.fill();
        for(let sp=0;sp<4;sp++){
          const spx=x-r*0.36+sp*r*0.24;
          ctx.save();ctx.translate(spx,y-r*0.44);ctx.save();ctx.shadowColor='#ffe060';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.fillStyle='#ffe060';ctx.fill();ctx.restore();
          ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-r*0.08,r*0.44);ctx.lineTo(r*0.08,r*0.44);ctx.closePath();ctx.fillStyle='rgba(255,220,80,0.05)';ctx.fill();ctx.restore();
        }
        ctx.beginPath();ctx.rect(x-r*0.1,y-r*0.28,r*0.2,r*0.24);ctx.fillStyle='rgba(20,10,40,0.8)';ctx.fill();
        ctx.beginPath();ctx.arc(x,y-r*0.28,r*0.1,Math.PI,0);ctx.fillStyle='rgba(20,10,40,0.8)';ctx.fill();
        ctx.strokeStyle='#b090d0';ctx.lineWidth=2;ctx.stroke();
        ctx.save();ctx.fillStyle='#5a4880';ctx.font=`bold ${r*0.08}px Georgia,serif`;ctx.textAlign='center';ctx.fillText('GALLERY',x,y-r*0.14);ctx.restore();
        for(let ls=0;ls<3;ls++){ctx.beginPath();ctx.rect(x-r*(0.22-ls*0.04),y-r*0.04+ls*r*0.03,r*(0.44-ls*0.08),r*0.03);ctx.fillStyle=`rgba(190,175,225,${0.85-ls*0.1})`;ctx.fill();}
        ctx.beginPath();ctx.ellipse(x-r*0.32,y+r*0.22,r*0.24,r*0.16,0,0,Math.PI*2);ctx.fillStyle='rgba(90,80,120,0.3)';ctx.fill();
        [[x-r*0.42,y+r*0.2],[x-r*0.25,y+r*0.14],[x-r*0.18,y+r*0.28]].forEach(([sx,sy])=>{
          ctx.beginPath();ctx.rect(sx-r*0.02,sy-r*0.1,r*0.04,r*0.14);const scg=ctx.createLinearGradient(sx,sy-r*0.1,sx,sy+r*0.04);scg.addColorStop(0,'#e8e8f0');scg.addColorStop(1,'#c8c8d8');ctx.fillStyle=scg;ctx.fill();ctx.strokeStyle='#a0a0b8';ctx.lineWidth=0.8;ctx.stroke();
          ctx.beginPath();ctx.arc(sx,sy-r*0.1,r*0.04,0,Math.PI*2);ctx.fillStyle='#d8d8e8';ctx.fill();ctx.strokeStyle='#a0a0b8';ctx.lineWidth=0.8;ctx.stroke();
        });
        ctx.save();ctx.shadowColor='rgba(100,150,255,0.5)';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(x+r*0.25,y+r*0.22,r*0.08,0,Math.PI*2);ctx.fillStyle='rgba(80,140,255,0.4)';ctx.fill();ctx.restore();
        for(let fj=0;fj<5;fj++){const fa=(fj/5)*Math.PI*2+tick*0.02,fh=r*0.05;ctx.beginPath();ctx.moveTo(x+r*0.25,y+r*0.22);ctx.lineTo(x+r+0.25+Math.cos(fa)*fh,y+r*0.22+Math.sin(fa)*fh*0.6);ctx.strokeStyle='rgba(150,200,255,0.55)';ctx.lineWidth=1.5;ctx.stroke();}
        ctx.save();ctx.translate(x+r*0.38,y+r*0.08);
        ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-r*0.06,r*0.15);ctx.moveTo(0,0);ctx.lineTo(r*0.06,r*0.15);ctx.moveTo(0,-r*0.01);ctx.lineTo(0,r*0.14);ctx.strokeStyle='#8a6020';ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();ctx.rect(-r*0.08,-r*0.18,r*0.16,r*0.16);ctx.fillStyle='#f8f4e8';ctx.fill();ctx.strokeStyle='#8a6020';ctx.lineWidth=1;ctx.stroke();
        const paintHue=(tick*2)%360;ctx.beginPath();ctx.arc(-r*0.02,-r*0.1,r*0.04,0,Math.PI*2);ctx.fillStyle=`hsla(${paintHue},70%,55%,0.6)`;ctx.fill();
        ctx.beginPath();ctx.arc(r*0.1,-r*0.05,r*0.04,0,Math.PI*2);ctx.fillStyle='rgba(60,40,20,0.6)';ctx.fill();
        ctx.beginPath();ctx.rect(r*0.06,r*0.0,r*0.08,r*0.1);ctx.fillStyle='rgba(60,40,20,0.6)';ctx.fill();
        ctx.restore();
        const pp=tick*0.007;const px3=x-r*0.44+Math.sin(pp)*r*0.06,py3=y+r*0.06+Math.cos(pp)*r*0.04;
        ctx.save();ctx.translate(px3,py3);ctx.rotate(pp*0.3);ctx.globalAlpha=0.82;
        ctx.beginPath();ctx.ellipse(0,0,r*0.11,r*0.08,0,0,Math.PI*2);ctx.fillStyle='#b8902a';ctx.fill();ctx.strokeStyle='#8a6018';ctx.lineWidth=1;ctx.stroke();
        ['#ff4040','#4040ff','#40c040','#ffff40','#ff40ff','#40ffff'].forEach((col,pi)=>{const pa=(pi/6)*Math.PI*2;ctx.beginPath();ctx.arc(Math.cos(pa)*r*0.07,Math.sin(pa)*r*0.05,r*0.022,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();});
        ctx.restore();
        for(let cs=0;cs<12;cs++){const ca=(cs/12)*Math.PI*2,cr2=r*(0.1+Math.random()*0.15);ctx.beginPath();ctx.arc(x+Math.cos(ca)*cr2,y+r*0.1+Math.sin(ca)*cr2*0.5,r*0.015,0,Math.PI*2);ctx.fillStyle=`hsla(${cs*30},80%,55%,0.25)`;ctx.fill();}
      } else if(theme==='crystal'){
        ctx.beginPath();ctx.rect(x-r*0.46,y-r*0.46,r*0.92,r*0.42);
        const scg2=ctx.createLinearGradient(x,y-r*0.46,x,y-r*0.04);scg2.addColorStop(0,'#e8d8c0');scg2.addColorStop(1,'#c8b898');ctx.fillStyle=scg2;ctx.fill();ctx.strokeStyle='#7a5030';ctx.lineWidth=1.5;ctx.stroke();
        for(let br=0;br<6;br++){ctx.beginPath();ctx.moveTo(x-r*0.46,y-r*0.39+br*r*0.065);ctx.lineTo(x+r*0.46,y-r*0.39+br*r*0.065);ctx.strokeStyle='rgba(0,0,0,0.06)';ctx.lineWidth=1;ctx.stroke();}
        for(let wr=0;wr<3;wr++)for(let wc=0;wc<5;wc++){
          const wx2=x-r*0.4+wc*r*0.18,wy2=y-r*0.42+wr*r*0.13;
          const lit=Math.sin(tick*0.02+wr*3+wc*2.1)>-0.4;
          ctx.beginPath();ctx.rect(wx2,wy2,r*0.12,r*0.09);ctx.fillStyle=lit?'rgba(255,240,180,0.88)':'rgba(150,130,100,0.5)';ctx.fill();ctx.strokeStyle='#7a5030';ctx.lineWidth=0.8;ctx.stroke();
          ctx.beginPath();ctx.moveTo(wx2+r*0.06,wy2);ctx.lineTo(wx2+r*0.06,wy2+r*0.09);ctx.moveTo(wx2,wy2+r*0.045);ctx.lineTo(wx2+r*0.12,wy2+r*0.045);ctx.strokeStyle='rgba(100,70,30,0.3)';ctx.lineWidth=0.5;ctx.stroke();
        }
        ctx.save();ctx.fillStyle='#5a3018';ctx.font=`bold ${r*0.08}px Georgia,serif`;ctx.textAlign='center';ctx.fillText('CAL POLY',x,y-r*0.22);ctx.fillStyle='rgba(80,50,20,0.6)';ctx.font=`${r*0.055}px Georgia,serif`;ctx.fillText('SAN LUIS OBISPO',x,y-r*0.14);ctx.restore();
        ctx.beginPath();ctx.rect(x-r*0.1,y-r*0.68,r*0.2,r*0.23);ctx.fillStyle='#d8c8a8';ctx.fill();ctx.strokeStyle='#7a5030';ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x-r*0.12,y-r*0.68);ctx.lineTo(x,y-r*0.82);ctx.lineTo(x+r*0.12,y-r*0.68);ctx.closePath();ctx.fillStyle='#8a4020';ctx.fill();
        ctx.beginPath();ctx.rect(x-r*0.05,y-r*0.62,r*0.1,r*0.08);ctx.fillStyle='rgba(180,210,255,0.5)';ctx.fill();ctx.beginPath();ctx.arc(x,y-r*0.62,r*0.05,Math.PI,0);ctx.fillStyle='rgba(180,210,255,0.5)';ctx.fill();
        const bsw=Math.sin(tick*0.08)*0.2;ctx.save();ctx.translate(x,y-r*0.58);ctx.rotate(bsw);
        ctx.save();ctx.shadowColor='#d4a020';ctx.shadowBlur=5;ctx.beginPath();ctx.arc(0,0,r*0.05,0,Math.PI*2);ctx.fillStyle='#c8a020';ctx.fill();ctx.restore();
        ctx.beginPath();ctx.moveTo(0,r*0.06);ctx.lineTo(0,r*0.09);ctx.strokeStyle='#8a6010';ctx.lineWidth=1;ctx.stroke();ctx.restore();
        for(let ss=0;ss<3;ss++){ctx.beginPath();ctx.rect(x-r*(0.22-ss*0.04),y-r*0.04+ss*r*0.03,r*(0.44-ss*0.08),r*0.03);ctx.fillStyle=`rgba(180,155,115,${0.85-ss*0.1})`;ctx.fill();}
        ctx.beginPath();ctx.rect(x-r*0.1,y-r*0.18,r*0.2,r*0.14);ctx.fillStyle='rgba(60,40,15,0.75)';ctx.fill();ctx.beginPath();ctx.arc(x,y-r*0.18,r*0.1,Math.PI,0);ctx.fillStyle='rgba(60,40,15,0.75)';ctx.fill();
        ctx.beginPath();ctx.moveTo(x+r*0.38,y+r*0.0);ctx.lineTo(x+r*0.38,y-r*0.4);ctx.strokeStyle='#c0c0c0';ctx.lineWidth=2.5;ctx.stroke();
        ctx.save();ctx.translate(x+r*0.38,y-r*0.4);
        ctx.beginPath();ctx.moveTo(0,0);
        for(let fw=0;fw<=10;fw++){ctx.lineTo(fw*r*0.025,Math.sin(fw*0.8-tick*0.12)*r*0.025);}
        ctx.lineTo(r*0.25,r*0.05);
        for(let fw=10;fw>=0;fw--){ctx.lineTo(fw*r*0.025,r*0.04+Math.sin(fw*0.8-tick*0.12)*r*0.025);}
        ctx.closePath();ctx.fillStyle='#3333cc';ctx.fill();
        ctx.beginPath();ctx.moveTo(0,r*0.02);for(let fw=0;fw<=10;fw++)ctx.lineTo(fw*r*0.025,r*0.02+Math.sin(fw*0.8-tick*0.12)*r*0.025);ctx.lineTo(r*0.25,r*0.025);ctx.strokeStyle='#ffcc00';ctx.lineWidth=3;ctx.stroke();ctx.restore();
        ctx.beginPath();ctx.ellipse(x-r*0.25,y+r*0.26,r*0.28,r*0.14,0,0,Math.PI*2);ctx.strokeStyle='rgba(200,80,20,0.5)';ctx.lineWidth=3;ctx.stroke();
        ctx.beginPath();ctx.ellipse(x-r*0.25,y+r*0.26,r*0.22,r*0.1,0,0,Math.PI*2);ctx.strokeStyle='rgba(200,80,20,0.35)';ctx.lineWidth=2;ctx.stroke();
        ctx.beginPath();ctx.ellipse(x-r*0.25,y+r*0.26,r*0.18,r*0.09,0,0,Math.PI*2);ctx.fillStyle='rgba(30,140,40,0.45)';ctx.fill();
        ctx.beginPath();ctx.moveTo(x-r*0.43,y+r*0.26);ctx.lineTo(x-r*0.07,y+r*0.26);ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.rect(x+r*0.14,y+r*0.08,r*0.24,r*0.18);ctx.strokeStyle='rgba(200,150,50,0.5)';ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();ctx.arc(x+r*0.26,y+r*0.08,r*0.06,0,Math.PI*2);ctx.strokeStyle='rgba(200,150,50,0.4)';ctx.lineWidth=1;ctx.stroke();
        ctx.save();ctx.shadowColor='#ff8020';ctx.shadowBlur=4;ctx.beginPath();ctx.arc(x+r*0.38,y+r*0.1,r*0.025,0,Math.PI*2);ctx.strokeStyle='#ff6010';ctx.lineWidth=2;ctx.stroke();
        ctx.restore();
        ctx.beginPath();ctx.moveTo(x+r*0.38,y+r*0.06);ctx.lineTo(x+r*0.38,y+r*0.02);ctx.strokeStyle='#888';ctx.lineWidth=1.5;ctx.stroke();
        ctx.save();ctx.translate(x+r*0.32,y-r*0.28);ctx.rotate(0);ctx.globalAlpha=0.9;
        ctx.beginPath();ctx.rect(-r*0.13,-r*0.065,r*0.26,r*0.09);ctx.fillStyle='#f8f4e8';ctx.fill();ctx.strokeStyle='#c8a050';ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();ctx.ellipse(-r*0.13,0,r*0.03,r*0.065,0,0,Math.PI*2);ctx.fillStyle='#ede8d8';ctx.fill();
        ctx.beginPath();ctx.ellipse(r*0.13,0,r*0.03,r*0.065,0,0,Math.PI*2);ctx.fillStyle='#ede8d8';ctx.fill();
        ctx.save();ctx.shadowColor='#c03020';ctx.shadowBlur=3;ctx.beginPath();ctx.arc(r*0.04,r*0.01,r*0.025,0,Math.PI*2);ctx.fillStyle='#c03020';ctx.fill();ctx.restore();
        ctx.beginPath();ctx.moveTo(-r*0.04,-r*0.065);ctx.lineTo(r*0.04,-r*0.065);ctx.strokeStyle='#c8a050';ctx.lineWidth=2;ctx.stroke();
        ctx.restore();
        ctx.save();ctx.translate(x-r*0.32,y-r*0.28);ctx.globalAlpha=0.85;
        ctx.beginPath();ctx.rect(-r*0.1,-r*0.012,r*0.2,r*0.012);ctx.fillStyle='#1a1a4a';ctx.fill();
        ctx.beginPath();ctx.rect(-r*0.075,-r*0.052,r*0.15,r*0.042);ctx.fillStyle='#1a1a4a';ctx.fill();
        ctx.beginPath();ctx.moveTo(r*0.075,-r*0.012);ctx.lineTo(r*0.075+r*0.04,r*0.06);ctx.strokeStyle='#c8a020';ctx.lineWidth=1.8;ctx.stroke();
        ctx.beginPath();ctx.arc(r*0.075+r*0.04,r*0.06,3,0,Math.PI*2);ctx.fillStyle='#c8a020';ctx.fill();
        ctx.restore();
        ctx.save();ctx.translate(x+r*0.1,y+r*0.2);ctx.rotate(-0.4);ctx.globalAlpha=0.85;
        ctx.beginPath();ctx.rect(-2,-r*0.2,4,r*0.2);ctx.fillStyle='#f0d020';ctx.fill();ctx.strokeStyle='#c0a010';ctx.lineWidth=0.8;ctx.stroke();
        ctx.beginPath();ctx.moveTo(-2,-r*0.2);ctx.lineTo(0,-r*0.24);ctx.lineTo(2,-r*0.2);ctx.closePath();ctx.fillStyle='#f0c0a0';ctx.fill();
        ctx.beginPath();ctx.rect(-2,r*0.0,4,r*0.02);ctx.fillStyle='#e080a0';ctx.fill();
        ctx.restore();
      } else if(theme==='sunset'){
        ctx.beginPath();ctx.moveTo(x-r*0.045,y-r*0.04);ctx.lineTo(x-r*0.025,y-r*0.82);ctx.lineTo(x+r*0.025,y-r*0.82);ctx.lineTo(x+r*0.045,y-r*0.04);ctx.closePath();
        const twg=ctx.createLinearGradient(x,y-r*0.82,x,y-r*0.04);twg.addColorStop(0,'#b0b0b8');twg.addColorStop(1,'#808090');ctx.fillStyle=twg;ctx.fill();ctx.strokeStyle='#686870';ctx.lineWidth=1;ctx.stroke();
        for(let ts=0;ts<7;ts++){const ty2=y-r*0.08-ts*r*0.105,tw=r*(0.12-ts*0.014);ctx.beginPath();ctx.moveTo(x-tw,ty2);ctx.lineTo(x+tw,ty2);ctx.strokeStyle='rgba(100,100,110,0.55)';ctx.lineWidth=1.5;ctx.stroke();
          ctx.beginPath();ctx.moveTo(x-tw,ty2);ctx.lineTo(x-(tw-r*0.012),ty2-r*0.105/2);ctx.moveTo(x+tw,ty2);ctx.lineTo(x+(tw-r*0.012),ty2-r*0.105/2);ctx.strokeStyle='rgba(100,100,110,0.25)';ctx.lineWidth=0.8;ctx.stroke();
        }
        for(let an=0;an<5;an++){const ax2=(an-2)*r*0.06;ctx.beginPath();ctx.moveTo(x+ax2,y-r*0.82);ctx.lineTo(x+ax2,y-r*(0.9+Math.abs(an-2)*0.02));ctx.strokeStyle='#909098';ctx.lineWidth=2;ctx.stroke();}
        if(Math.sin(tick*0.18)>0.5){ctx.save();ctx.shadowColor='#ff2020';ctx.shadowBlur=14;ctx.beginPath();ctx.arc(x,y-r*0.92,4,0,Math.PI*2);ctx.fillStyle='#ff2020';ctx.fill();ctx.restore();}
        for(let sw=0;sw<4;sw++){const swp=((tick*0.018+sw*0.25)%1);const swr=r*(0.08+swp*0.55);ctx.beginPath();ctx.arc(x,y-r*0.55,swr,Math.PI*1.15,Math.PI*1.85);ctx.strokeStyle=`rgba(80,200,255,${0.45*(1-swp)})`;ctx.lineWidth=1.5;ctx.stroke();ctx.beginPath();ctx.arc(x,y-r*0.55,swr,Math.PI*0.15,Math.PI*-0.15+0.15,true);ctx.strokeStyle=`rgba(80,200,255,${0.45*(1-swp)})`;ctx.lineWidth=1.5;ctx.stroke();}
        ctx.beginPath();ctx.rect(x-r*0.42,y-r*0.32,r*0.34,r*0.28);
        const crg=ctx.createLinearGradient(x-r*0.42,y-r*0.32,x-r*0.08,y-r*0.04);crg.addColorStop(0,'#5a5a70');crg.addColorStop(1,'#3a3a50');ctx.fillStyle=crg;ctx.fill();ctx.strokeStyle='#2a2a40';ctx.lineWidth=1.2;ctx.stroke();
        for(let sc=0;sc<3;sc++){
          ctx.beginPath();ctx.rect(x-r*0.38+sc*r*0.1,y-r*0.27,r*0.08,r*0.1);ctx.fillStyle=['rgba(0,200,100,0.5)','rgba(0,150,255,0.5)','rgba(255,100,0,0.4)'][sc];ctx.fill();
          for(let sl=0;sl<3;sl++){ctx.beginPath();ctx.moveTo(x-r*0.38+sc*r*0.1,y-r*0.24+sl*r*0.03);ctx.lineTo(x-r*0.3+sc*r*0.1,y-r*0.24+sl*r*0.03);ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=0.8;ctx.stroke();}
        }
        ctx.save();ctx.fillStyle='#80c0ff';ctx.font=`${r*0.04}px monospace`;ctx.textAlign='center';ctx.fillText('CTRL',x-r*0.25,y-r*0.12);ctx.restore();
        ctx.save();ctx.translate(x-r*0.28,y-r*0.32);ctx.rotate(0.5);
        ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r*0.1,Math.PI*0.1,Math.PI*0.9);ctx.closePath();ctx.fillStyle='#8888a0';ctx.fill();ctx.strokeStyle='#606080';ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.fillStyle='#505060';ctx.fill();ctx.restore();
        for(let ph=0;ph<3;ph++){
          const phx=x+r*(0.08+ph*0.12),phy=y-r*0.06;
          ctx.beginPath();ctx.rect(phx,phy-r*0.28,r*0.09,r*0.28);ctx.fillStyle='#cc2020';ctx.fill();ctx.strokeStyle='#881010';ctx.lineWidth=1.2;ctx.stroke();
          ctx.beginPath();ctx.rect(phx+r*0.01,phy-r*0.22,r*0.07,r*0.14);ctx.fillStyle='rgba(150,220,255,0.65)';ctx.fill();
          ctx.beginPath();ctx.moveTo(phx-r*0.01,phy-r*0.28);ctx.lineTo(phx+r*0.045,phy-r*0.34);ctx.lineTo(phx+r*0.1,phy-r*0.28);ctx.closePath();ctx.fillStyle='#aa1010';ctx.fill();
        }
        for(let mb=0;mb<4;mb++){
          const mbx=x+r*(0.08+mb*0.08);
          ctx.beginPath();ctx.rect(mbx,y+r*0.1,r*0.07,r*0.1);ctx.fillStyle=['#2244cc','#22aacc','#cc4422','#22cc44'][mb];ctx.fill();ctx.strokeStyle='rgba(0,0,0,0.3)';ctx.lineWidth=0.8;ctx.stroke();
          ctx.beginPath();ctx.ellipse(mbx+r*0.035,y+r*0.1,r*0.035,r*0.025,0,Math.PI,0);ctx.fillStyle=['#3355dd','#33bbdd','#dd5533','#33dd55'][mb];ctx.fill();
        }
        ctx.save();ctx.translate(x+r*0.36,y-r*0.14);ctx.rotate(-0.8);
        ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r*0.18,Math.PI*0.05,Math.PI*0.95);ctx.closePath();ctx.fillStyle='#c0c0c8';ctx.fill();ctx.strokeStyle='#909098';ctx.lineWidth=1.2;ctx.stroke();
        ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.fillStyle='#707080';ctx.fill();
        ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-r*0.2);ctx.strokeStyle='#808090';ctx.lineWidth=2;ctx.stroke();ctx.restore();
        ctx.beginPath();ctx.rect(x+r*0.38,y-r*0.14,r*0.04,r*0.18);ctx.fillStyle='#888890';ctx.fill();
        ctx.beginPath();ctx.rect(x+r*0.06,y+r*0.08,r*0.36,r*0.04);ctx.fillStyle='#4a4a5a';ctx.fill();ctx.strokeStyle='#2a2a3a';ctx.lineWidth=1;ctx.stroke();
        for(let ph=0;ph<4;ph++){
          const phx=x+r*0.1+ph*r*0.08;
          ctx.beginPath();ctx.rect(phx-r*0.03,y-r*0.08,r*0.055,r*0.16);ctx.fillStyle='#181828';ctx.fill();ctx.strokeStyle='#333348';ctx.lineWidth=0.8;ctx.stroke();
          ctx.beginPath();ctx.rect(phx-r*0.025,y-r*0.075,r*0.045,r*0.11);ctx.fillStyle=`hsl(${ph*90},65%,45%)`;ctx.fill();
          for(let ic=0;ic<4;ic++){ctx.beginPath();ctx.arc(phx-r*0.01+(ic%2)*r*0.02,y-r*0.055+Math.floor(ic/2)*r*0.02,r*0.007,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fill();}
          ctx.beginPath();ctx.arc(phx,y+r*0.04,r*0.007,0,Math.PI*2);ctx.fillStyle='#555';ctx.fill();
        }
      }

      ctx.save();ctx.shadowColor='rgba(0,0,0,0.95)';ctx.shadowBlur=8;
      ctx.fillStyle=t.accent;ctx.font=`bold ${r>100?14:13}px Georgia,serif`;ctx.textAlign='center';ctx.fillText(name,x,y+r*.62+22);
      ctx.fillStyle='rgba(255,240,180,0.7)';ctx.font='11px Georgia,serif';ctx.fillText(`[${lbl}]`,x,y+r*.62+36);ctx.restore();

      ctx.restore();
    }
    function drawShip() {
      const { x, y, ang, spd } = shipRef.current;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang - Math.PI / 2);
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.55)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetX = 6;
      ctx.shadowOffsetY = 8;
      ctx.beginPath();
      ctx.moveTo(0, -38);
      ctx.bezierCurveTo(22, -24, 24, 8, 17, 30);
      ctx.lineTo(-17, 30);
      ctx.bezierCurveTo(-24, 8, -22, -24, 0, -38);
      ctx.closePath();
      ctx.fillStyle = "#eeeae0";
      ctx.fill();
      ctx.restore();
      ctx.beginPath();
      ctx.moveTo(0, -38);
      ctx.bezierCurveTo(22, -24, 24, 8, 17, 30);
      ctx.lineTo(-17, 30);
      ctx.bezierCurveTo(-24, 8, -22, -24, 0, -38);
      ctx.closePath();
      ctx.strokeStyle = "#1e2d5a";
      ctx.lineWidth = 5.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -29);
      ctx.bezierCurveTo(15, -18, 17, 5, 13, 24);
      ctx.lineTo(-13, 24);
      ctx.bezierCurveTo(-17, 5, -15, -18, 0, -29);
      ctx.fillStyle = "#c07030";
      ctx.fill();
      for (let i = 0; i < 5; i++) {
        const p = i / 4,
          py = -24 + p * 46,
          w = 5 + 8 * Math.sin(p * Math.PI);
        ctx.beginPath();
        ctx.moveTo(-w, py);
        ctx.lineTo(w, py);
        ctx.strokeStyle = "rgba(55,22,4,0.28)";
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(0, -5, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#8b6010";
      ctx.fill();
      const bx =
        Math.min(spd * 1.5, 5) + Math.sin(tickRef.current * 0.03) * 2.5;
      ctx.beginPath();
      ctx.moveTo(-20, -24);
      ctx.quadraticCurveTo(-20 + bx, -9, -17, 9);
      ctx.lineTo(17, 9);
      ctx.quadraticCurveTo(20 + bx, -9, 20, -24);
      ctx.closePath();
      ctx.fillStyle = "rgba(242,228,182,0.97)";
      ctx.fill();
      ctx.strokeStyle = "#b89050";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.fillStyle = "rgba(80,28,5,0.7)";
      ctx.font = "bold 9px serif";
      ctx.textAlign = "center";
      ctx.fillText("KL", bx / 2, -7);
      ctx.beginPath();
      ctx.moveTo(-22, -24);
      ctx.lineTo(22, -24);
      ctx.strokeStyle = "#7a4010";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -24);
      ctx.lineTo(0, -52);
      ctx.strokeStyle = "#7a4010";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-22, -24);
      ctx.lineTo(0, -52);
      ctx.moveTo(22, -24);
      ctx.lineTo(0, -52);
      ctx.strokeStyle = "rgba(155,110,50,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -38);
      ctx.lineTo(0, -56);
      ctx.strokeStyle = "#8b6010";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -52);
      ctx.lineTo(13, -45);
      ctx.lineTo(0, -38);
      ctx.closePath();
      ctx.fillStyle = "#111";
      ctx.fill();
      ctx.save();
      ctx.translate(0, -38);
      ctx.beginPath();
      ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
      ctx.fillStyle = "#f8f8f4";
      ctx.fill();
      ctx.strokeStyle = "#bbb";
      ctx.lineWidth = 0.8;
      ctx.stroke();
      for (let a = 0; a < 6; a++) {
        const ang2 = (a / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(
          Math.cos(ang2) * 5.2,
          Math.sin(ang2) * 5.2,
          2.8,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "#f2f0ea";
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(-5, -3.5, 3.2, Math.PI * 0.75, Math.PI * 0.1);
      ctx.strokeStyle = "#c8a060";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(5, -3.5, 3.2, Math.PI * 0.9, Math.PI * 0.25, true);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-2.8, 0.8, 1.3, 0, Math.PI * 2);
      ctx.fillStyle = "#333";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(2.8, 0.8, 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-2.2, 0.2, 0.5, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(3.4, 0.2, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 3, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = "#ff9999";
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.shadowColor = "rgba(255,140,0,.9)";
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(0, 26, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#ffcc44";
      ctx.fill();
      ctx.restore();
      ctx.restore();
    }

    function drawWake() {
      wakeRef.current.forEach((p) => {
        const life = 1 - p.age / p.ma;
        ctx.beginPath();
        ctx.arc(p.wx, p.wy, 3 + (1 - life) * 18, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140,200,255,${life * 0.2})`;
        ctx.fill();
      });
    }

    function drawCompass(H: number) {
      const cr = 32,
        cx = 54,
        cy = H - 54;
      ctx.save();
      ctx.globalAlpha = 0.88;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(8,20,40,0.92)";
      ctx.fill();
      ctx.strokeStyle = "#c8a870";
      ctx.lineWidth = 1.8;
      ctx.stroke();
      (["N", "E", "S", "W"] as const).forEach((l, i) => {
        const a = (i * Math.PI) / 2;
        ctx.fillStyle = l === "N" ? "#ff5555" : "#c8a870";
        ctx.font = "bold 8px Georgia,serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          l,
          cx + Math.sin(a) * (cr - 10),
          cy - Math.cos(a) * (cr - 10),
        );
      });
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(shipRef.current.ang);
      ctx.beginPath();
      ctx.moveTo(0, -30);
      ctx.lineTo(3.5, 4);
      ctx.lineTo(-3.5, 4);
      ctx.closePath();
      ctx.fillStyle = "#ff4444";
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 30);
      ctx.lineTo(3.5, -4);
      ctx.lineTo(-3.5, -4);
      ctx.closePath();
      ctx.fillStyle = "#c8a870";
      ctx.fill();
      ctx.restore();
      ctx.restore();
    }

    // ═══════════════════════════════════════════════════════════════
    // MAIN GAME LOOP - COMPLETE
    // ═══════════════════════════════════════════════════════════════

    function loop() {
      tickRef.current++;
      const W = canvas.width,
        H = canvas.height;
      islesRef.current = ISLE_DATA.map((d) => ({
        ...d,
        x: d.pX * W,
        y: d.pY * H,
      }));
      const s = shipRef.current,
        k = keysRef.current;
      let ax = 0,
        ay = 0;
      if (k["ArrowUp"] || k["w"] || k["W"]) ay -= ACCEL;
      if (k["ArrowDown"] || k["s"] || k["S"]) ay += ACCEL;
      if (k["ArrowLeft"] || k["a"] || k["A"]) ax -= ACCEL;
      if (k["ArrowRight"] || k["d"] || k["D"]) ax += ACCEL;
      s.vx = (s.vx + ax) * FRIC;
      s.vy = (s.vy + ay) * FRIC;
      const spd = Math.hypot(s.vx, s.vy);
      if (spd > MSPD) {
        s.vx = (s.vx / spd) * MSPD;
        s.vy = (s.vy / spd) * MSPD;
      }
      s.spd = spd;
      if (spd > 0.08) s.ang = Math.atan2(s.vy, s.vx);
      islesRef.current.forEach((isle) => {
        const dx = s.x - isle.x,
          dy = s.y - isle.y;
        const a = isle.r + 18,
          b = isle.r * 0.62 + 12;
        const nx = dx / a,
          ny = dy / b;
        const ed = Math.sqrt(nx * nx + ny * ny);
        if (ed < 1 && ed > 0.0001) {
          s.x = isle.x + dx / ed;
          s.y = isle.y + dy / ed;
          const normX = nx / a,
            normY = ny / b;
          const nLen = Math.sqrt(normX * normX + normY * normY);
          const nxN = normX / nLen,
            nyN = normY / nLen;
          const dot = s.vx * nxN + s.vy * nyN;
          if (dot < 0) {
            s.vx -= dot * nxN;
            s.vy -= dot * nyN;
          }
        }
      });
      s.x = Math.max(40, Math.min(W - 40, s.x + s.vx));
      s.y = Math.max(40, Math.min(H - 40, s.y + s.vy));
      if (spd > 0.25 && tickRef.current % 3 === 0)
        wakeRef.current.push({
          wx: s.x - Math.cos(s.ang) * 24,
          wy: s.y - Math.sin(s.ang) * 24,
          age: 0,
          ma: 45,
        });
      wakeRef.current = wakeRef.current
        .map((p) => ({ ...p, age: p.age + 1 }))
        .filter((p) => p.age < p.ma);
      trailRef.current.push({ x: s.x, y: s.y });
      if (trailRef.current.length > TRAIL_LEN) trailRef.current.shift();
      nearRef.current = null;
      islesRef.current.forEach((i) => {
        if (Math.hypot(s.x - i.x, s.y - i.y) < IDIST) nearRef.current = i;
      });
      setNear((nearRef.current as Isle | null)?.id || null);

      whalesRef.current.forEach((wh) => steer(wh, 1.1, islesRef.current, W, H));
      turtlesRef.current.forEach((tu) =>
        steer(tu, 0.42, islesRef.current, W, H),
      );
      updateSerpent(W, H);

      drawOcean(W, H);
      drawTrail();
      drawWrecks(W, H);
      islesRef.current.forEach((isle) => drawIsle(isle));
      drawWake();
      whalesRef.current.forEach((wh) => drawWhale(wh, tickRef.current));
      turtlesRef.current.forEach((tu) => drawTurtle(tu, tickRef.current));
      drawSerpent();
      drawBirds(W, H);
      drawShip();
      drawCompass(H);
      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("mousemove", onMove);
    };
  }, [cvsRef, refs, state, isActive]);
}
export const ISLE_DATA = [
  {
    id: "home",
    name: "Home Island",
    lbl: "Home",
    pX: 0.5,
    pY: 0.5,
    r: 145,
    theme: "emerald",
  },
  {
    id: "contact",
    name: "Contact Island",
    lbl: "Contact",
    pX: 0.5,
    pY: 0.16,
    r: 105,
    theme: "sunset",
  },
  {
    id: "blog",
    name: "Blog Island",
    lbl: "Blog",
    pX: 0.86,
    pY: 0.3,
    r: 118,
    theme: "storm",
  },
  {
    id: "portfolio",
    name: "Portfolio Island",
    lbl: "Portfolio",
    pX: 0.86,
    pY: 0.76,
    r: 140,
    theme: "golden",
  },
  {
    id: "resume",
    name: "Resume Island",
    lbl: "Resume",
    pX: 0.14,
    pY: 0.76,
    r: 125,
    theme: "crystal",
  },
];

export const ROUTES: Record<string, string> = {
  home: "/",
  blog: "/blog/",
  portfolio: "/portfolio/",
  resume: "/resume/",
  contact: "/contact/",
};

export const THEMES: Record<string, { sand: string; top: string; accent: string }> = {
  emerald: { sand: "#829e7d", top: "#829e7d", accent: "#80ff90" },
  storm: { sand: "#829e7d", top: "#829e7d", accent: "#ffe080" },
  golden: { sand: "#829e7d", top: "#829e7d", accent: "#ffd060" },
  crystal: { sand: "#829e7d", top: "#829e7d", accent: "#a0e8ff" },
  sunset: { sand: "#829e7d", top: "#829e7d", accent: "#ffaa60" },
};

export const WRECKS = Array.from({ length: 12 }, (_, i) => ({
  pX: (((i * 173 + 89 + i * 61) % 8200) + 300) / 9800,
  pY: (((i * 251 + 137 + i * 97) % 7000) + 500) / 9000,
  rot: (i * 0.71) % Math.PI,
  sz: 0.5 + Math.sin(i * 1.3) * 0.25,
}));

export const BIRD_FLOCKS = Array.from({ length: 5 }, (_, fi) => ({
  pX: fi * 0.22,
  pY: 0.07 + fi * 0.19,
  dir: fi % 2 === 0 ? 1 : -1,
  speed: 0.00015 + fi * 0.00003,
  count: 4 + fi * 2,
  phase: fi * 1.6,
}));

export const ISLAND_WALKERS: Record<
  string,
  { angle: number; speed: number; shirt: string; pants: string; side: number }[]
> = {
  home: [
    { angle: 0, speed: 0.003, shirt: "#4a7ab5", pants: "#2a2a2a", side: 1 },
    { angle: 2.1, speed: 0.0025, shirt: "#f5f0e0", pants: "#3a2510", side: -1 },
    { angle: 4.2, speed: 0.0028, shirt: "#3a7a3a", pants: "#1a1a3a", side: 1 },
  ],
  blog: [
    { angle: 0.5, speed: 0.0028, shirt: "#c8c8b0", pants: "#2a2010", side: 1 },
    { angle: 2.6, speed: 0.0025, shirt: "#2a4a8a", pants: "#1a1a1a", side: -1 },
  ],
  portfolio: [
    { angle: 1.0, speed: 0.003, shirt: "#1a1a1a", pants: "#3a2510", side: 1 },
    { angle: 3.1, speed: 0.0025, shirt: "#d8c8a0", pants: "#2a2a2a", side: -1 },
    { angle: 5.0, speed: 0.0028, shirt: "#4a6a3a", pants: "#1a1a3a", side: 1 },
  ],
  resume: [
    { angle: 0.8, speed: 0.0028, shirt: "#2a4a8a", pants: "#1a1a1a", side: 1 },
    { angle: 2.9, speed: 0.003, shirt: "#e8e8e8", pants: "#2a2010", side: -1 },
  ],
  contact: [
    { angle: 1.5, speed: 0.0025, shirt: "#3a7a3a", pants: "#2a2a2a", side: 1 },
    { angle: 3.6, speed: 0.0028, shirt: "#8a6a40", pants: "#1a1a3a", side: -1 },
  ],
};

export const CAT = { angle: 1.2, speed: 0.004 };

export const FOAM = Array.from({ length: 60 }, (_, i) => ({
  pX: ((i * 37 * 127 + 113) % 9973) / 9973,
  pY: ((i * 53 * 89 + 227) % 9871) / 9871,
  ph: i * 2.17,
  sz: 1.5 + (i % 3) * 0.7,
}));

export const SUBTITLES = [
  "Sail the seas to learn more about me",
  "Built with React and MongoDB",
  "Computer Science Major at Cal Poly SLO",
];

export const ACCEL = 0.2;
export const FRIC = 0.87;
export const MSPD = 4.0;
export const IDIST = 185;
export const TRAIL_LEN = 80;

export type Isle = (typeof ISLE_DATA)[0] & { x: number; y: number };
export type Pt = { x: number; y: number };
export type CS = { x: number; y: number; vx: number; vy: number; ang: number };
export type SS = CS & { trail: Pt[] };

export function shouldSkipHomePosterEntrance() {
  if (typeof window === "undefined") return false;
  try {
    const flagged =
      window.sessionStorage.getItem("skipHomePosterEnter") === "1";
    const ref = document.referrer ? new URL(document.referrer) : null;
    const fromInternalIsland =
      !!ref && ref.origin === window.location.origin && ref.pathname !== "/";
    return flagged || fromInternalIsland;
  } catch {
    return false;
  }
}
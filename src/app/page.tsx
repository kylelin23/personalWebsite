"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import style from "./home.module.css";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const connectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(cardRef.current, { opacity: 0, y: 60, scale: 0.95, duration: 1 })
      .from(photoRef.current, { opacity: 0, scale: 0.8, duration: 0.7 }, "-=0.5")
      .from(textRef.current?.children ?? [], { opacity: 0, y: 20, stagger: 0.15, duration: 0.6 }, "-=0.4")
      .from(badgesRef.current?.children ?? [], { opacity: 0, x: -20, stagger: 0.1, duration: 0.4 }, "-=0.3");

    if (introRef.current) {
      gsap.from(introRef.current.querySelector(`.${style.introHeading}`), {
        scrollTrigger: { trigger: introRef.current, start: "top 80%" },
        opacity: 0, x: -60, duration: 0.7,
      });
      gsap.from(introRef.current.querySelector(`.${style.introSub}`), {
        scrollTrigger: { trigger: introRef.current, start: "top 80%" },
        opacity: 0, x: 60, duration: 0.7, delay: 0.2,
      });
    }

    if (bioRef.current) {
      gsap.from(bioRef.current.querySelector(`.${style.bioInner}`), {
        scrollTrigger: { trigger: bioRef.current, start: "top 75%" },
        opacity: 0, x: -40, duration: 0.8,
      });
    }

    if (statsRef.current) {
      gsap.from(statsRef.current.querySelectorAll(`.${style.stat}`), {
        scrollTrigger: { trigger: statsRef.current, start: "top 80%" },
        opacity: 0, y: 40, scale: 0.8, stagger: 0.15, duration: 0.6, ease: "back.out(1.7)",
      });
    }

    if (connectRef.current) {
      gsap.from(connectRef.current.querySelectorAll(`.${style.logoLink}`), {
        scrollTrigger: { trigger: connectRef.current, start: "top 85%" },
        opacity: 0, y: 30, stagger: 0.2, duration: 0.6,
      });
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div className={style.nightBg}>

      {/* ── Night sky ── */}
      <div className={style.sky} />

      {/* ── Cloud layers ── */}
      <div className={`${style.cloudLayer} ${style.cloudLayer1}`}>
        <div className={style.cloud} />
        <div className={style.cloud} />
        <div className={style.cloud} />
        <div className={style.cloud} />
      </div>
      <div className={`${style.cloudLayer} ${style.cloudLayer2}`}>
        <div className={style.cloud} />
        <div className={style.cloud} />
        <div className={style.cloud} />
      </div>
      <div className={`${style.cloudLayer} ${style.cloudLayer3}`}>
        <div className={style.cloud} />
        <div className={style.cloud} />
        <div className={style.cloud} />
        <div className={style.cloud} />
      </div>

      {/* ── Hero ── */}
      <div className={style.hero}>
        <div className={style.glassCard} ref={cardRef}>
          <div className={style.cardTop}>
            <div className={style.photoWrapper} ref={photoRef}>
              <img src="/assets/aboutImage.jpeg" alt="Kyle Lin" className={style.photo} />
              <div className={style.photoRing} />
            </div>
            <div className={style.cardText} ref={textRef}>
              <p className={style.greeting}>Hey, I'm</p>
              <h1 className={style.name}>Kyle <span className={style.accent}>Lin</span></h1>
              <p className={style.sub}>B.S. Computer Science · Cal Poly SLO · Class of 2027</p>
            </div>
          </div>

          <div className={style.cardDivider} />

          <div className={style.cardBottom}>
            <div className={style.badges} ref={badgesRef}>
              <span className={style.badge}>Software Developer</span>
            </div>
            <div className={style.socialRow}>
              <Link href="https://www.linkedin.com/in/kyle-lin-584235295/" className={style.socialBtn}>
                <img src="/assets/logos/LI-In-Bug.png" alt="LinkedIn" width={22} height={22} />
                LinkedIn
              </Link>
              <Link href="https://github.com/kylelin23" className={style.socialBtn}>
                <img src="/assets/logos/github-mark.png" alt="GitHub" width={22} height={22} />
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Intro strip ── */}
      <div className={style.introStrip} ref={introRef}>
        <span className={style.introLabel}>WHO I AM</span>
        <h2 className={style.introHeading}>Hi, I'm <span className={style.accent}>Kyle Lin</span></h2>
        <p className={style.introSub}>Will · Change · Later</p>
      </div>

      {/* ── Bio section ── */}
      <div className={style.bioSection} ref={bioRef}>
        <div className={style.bioInner}>
          <p className={style.bioText}>
            I am currently pursuing my <strong>B.S. in Computer Science at Cal Poly SLO</strong> as
            an honors student, with an anticipated graduation of 2027. I have a solid foundation
            in multiple programming languages and am committed to constantly expanding my skills.
          </p>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className={style.statsStrip} ref={statsRef}>
        <div className={style.stat}>
          <span className={style.statNumber}>INFO</span>
          <span className={style.statLabel}>INFO</span>
        </div>
        <div className={style.statDivider} />
        <div className={style.stat}>
          <span className={style.statNumber}>INFO</span>
          <span className={style.statLabel}>INFO</span>
        </div>
        <div className={style.statDivider} />
        <div className={style.stat}>
          <span className={style.statNumber}>INFO</span>
          <span className={style.statLabel}>INFO</span>
        </div>
      </div>

      {/* ── Connect section ── */}
      <div className={style.connectSection} ref={connectRef}>
        <span className={style.introLabel}>FIND ME ON</span>
        <div className={style.logos}>
          <Link href="https://www.linkedin.com/in/kyle-lin-584235295/" className={style.logoLink}>
            <img src="/assets/logos/LI-In-Bug.png" alt="Linkedin Logo" width={50} height={50} />
            <span>LinkedIn</span>
          </Link>
          <Link href="https://github.com/kylelin23" className={style.logoLink}>
            <img src="/assets/logos/github-mark.png" alt="Github Logo" width={50} height={50} />
            <span>GitHub</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
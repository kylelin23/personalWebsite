"use client";
import { useEffect, useState } from "react";
import style from "./navbar.module.css";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${style.navbar} ${scrolled ? style.scrolled : ""}`}>
      <h1><Link href="/" className={style.logo}>Kyle Lin</Link></h1>
      <div className={style.navList}>
        <Link href="/" className={style.navbarLink}>Home</Link>
        <Link href="/blog/" className={style.navbarLink}>Blog</Link>
        <Link href="/portfolio/" className={style.navbarLink}>Portfolio</Link>
        <Link href="/resume/" className={style.navbarLink}>Resume</Link>
        <Link href="/contact/" className={style.navbarLink}>Contact</Link>
      </div>
    </header>
  );
}
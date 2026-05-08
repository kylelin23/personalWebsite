import style from "./footer.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={style.footer}>
      <div className={style.topBorder} />
      <div className={style.strip}>
        {/* Left — brand */}
        <span className={style.brandName}>Kyle Lin</span>

        {/* Center — nav links */}
        <nav className={style.nav}>
          <Link href="/" className={style.link}>Home</Link>
          <span className={style.dot}>·</span>
          <Link href="/blog" className={style.link}>Blog</Link>
          <span className={style.dot}>·</span>
          <Link href="/portfolio" className={style.link}>Portfolio</Link>
          <span className={style.dot}>·</span>
          <Link href="/resume" className={style.link}>Resume</Link>
          <span className={style.dot}>·</span>
          <Link href="/contact" className={style.link}>Contact</Link>
        </nav>

        {/* Right — copyright */}
        <span className={style.copyright}>© 2025 Kyle Lin</span>
      </div>
    </footer>
  );
}
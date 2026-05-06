import style from "./footer.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className = {style.footer}>
        <Link href = "https://www.svgbackgrounds.com/elements/triple-threat-svg-icons/" className = {style.footerText}><u>Icons and Backgrounds by SVGBackgrounds.com</u></Link>
        <Link href="https://icons8.com" className = {style.footerText}><u>Java logo icon,
            C Programming icon, JavaScript icon, React Native icon, Vite icon,
            Html 5 icon, CSS Logo icon, Figma icon, PostgreSQL icon, Git icon, AWS icon by Icons8</u></Link>
        <p className = {style.footerText}>© 2025 Kyle Lin's Personal Website | All Rights Reserved</p>
    </footer>
  );
}
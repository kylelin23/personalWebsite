import style from "./blog.module.css";
import Link from "next/link";


export default function Blog() {
  return (
    <div>
      <div className={style.gradientContainer}>
        <h1 className={style.pageTitle}>Blog</h1>
      </div>
      <div className = {style.infoContainer}>
        <div className = {style.midAutumnContainer}>
            <Link className = {style.link} href = "/blog/midAutumnFestival.html">Mid Autumn Festival</Link>
        </div>
        <div className = {style.firstWeekOfSchool}>
            <Link className = {style.link} href = "/blog/firstWeekOfSchool.html">First Week Of School</Link>
        </div>
      </div>
    </div>
  );
}

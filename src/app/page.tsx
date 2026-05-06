import Image from "next/image";
import style from "./home.module.css"
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className = {style.container}>
        <h1 className = {style.pageTitle}>About Me</h1>
      </div>
      <div className = {style.about}>
        <div className = {style.aboutText}>
          <p>
            Hi, I'm <strong>Kyle Lin!</strong>
          </p>
          <p>
            I am currently pursuing my
            <strong> Bachelors of Science in Computer Science
            at California Polytechnic State University in
            San Luis Obispo as an honors student</strong>,
            and have an anticipated graduation date of 2027.
            I have a solid foundation in multiple programming languages
            and am committed to expanding my knowledge and skills.
            You can check out my LinkedIn and GitHub below!
          </p>
          <div className = {style.logos}>
            <Link href = "https://www.linkedin.com/in/kyle-lin-584235295/">
              <img src = "assets/logos/LI-In-Bug.png" alt = "Linkedin Logo" width = {100} height = {100} />
            </Link>
            <Link href = "https://github.com/kylelin23">
              <img src = "assets/logos/github-mark.png" alt = "Github Logo" width = {100} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

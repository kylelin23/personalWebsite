import Link from "next/link";
import style from "./resume.module.css";
import Skill from "../../components/skill/skill"
import { programmingLanguages, frontEnd, backEnd, other, certifications } from "../resumeData"

export default function Resume() {
  return (
    <div className={style.resume}>
      <div className={style.gradientContainer}>
        <h1 className={style.pageTitle}>Resume</h1>
      </div>

      <div className={style.resumeInfoContainer}>
        <div className={style.resumeButtonContainer}>
          <Link className={style.resumeButton} href="assets/resume.pdf">
            Download Resume
          </Link>
        </div>

        <div className={style.entry}>
          <p className={style.sectionTitle}>Education</p>
          <div className={style.schools}>
            <div className={style.outerContainer}>
              <div className={style.schoolContainer}>
                <img
                  src="assets/logos/calPolyLogo.jpg"
                  alt="Cal Poly Logo"
                  width={300}
                />
                <div className={style.schoolDetails}>
                  <p className={style.schoolName}>
                    California Polytechnic State University San Luis Obispo
                  </p>
                  <p className={style.schoolDescription}>
                    <strong>Concentration: </strong>Bachelor of Science Computer
                    Science
                  </p>
                  <p className={style.schoolDescription}>
                    <strong>Expected Graduation Date: </strong>May 2027
                  </p>
                  <p className={style.schoolDescription}>
                    <strong>Coursework: </strong>Data Structures, Introduction
                    to Computer Organization, Object Oriented Programming,
                    Discrete Structures, Systems Programming, Design and
                    Analysis of Algorithms, Intro to Database Systems
                  </p>
                  <p className={style.schoolDescription}>
                    <strong>Relevant Projects: </strong>Adventure game made in
                    Java including polymorphism and class inheritance and rental
                    review app made with React, Express, and MongoDB
                  </p>
                </div>
              </div>
            </div>

            <div className={style.outerContainer}>
              <div className={style.schoolContainer}>
                <img
                  src="assets/logos/ntuLogo.jpeg"
                  alt="NTU Logo"
                  width={300}
                />
                <div className={style.schoolDetails}>
                  <p className={style.schoolName}>
                    Nanyang Technological University
                  </p>
                  <p className={style.schoolDescription}>
                    <strong>Term: </strong>Summer 2025 Study Abroad
                  </p>
                  <p className={style.schoolDescription}>
                    <strong>Coursework: </strong>Cybersecurity (learned about
                    cyberattacks and encryption algorithms)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.entry}>
          <p className={style.sectionTitle}>Skills</p>

          <p className={style.skillSectionTitle}>Programming Languages</p>
          <div className={style.skills}>
            {programmingLanguages.map(skill =>
              <Skill
                key = {skill.key}
                name = {skill.name}
                img = {skill.img}
                imgAlt = {skill.imgAlt}
              />
            )}
          </div>

          <p className={style.skillSectionTitle}>Front-End</p>
          <div className={style.skills}>
            {frontEnd.map(skill =>
              <Skill
                key = {skill.key}
                name = {skill.name}
                img = {skill.img}
                imgAlt = {skill.imgAlt}
              />
            )}
          </div>

          <p className={style.skillSectionTitle}>Back-End</p>
          <div className={style.skills}>
            {backEnd.map(skill =>
              <Skill
                key = {skill.key}
                name = {skill.name}
                img = {skill.img}
                imgAlt = {skill.imgAlt}
              />
            )}
          </div>

          <p className={style.skillSectionTitle}>Other</p>
          <div className={style.skills}>
            {other.map(skill =>
              <Skill
                key = {skill.key}
                name = {skill.name}
                img = {skill.img}
                imgAlt = {skill.imgAlt}
              />
            )}
          </div>

          <p className={style.skillSectionTitle}>Certifications</p>
          <div className={style.skills}>
            {certifications.map(skill =>
              <Skill
                key = {skill.key}
                name = {skill.name}
                img = {skill.img}
                imgAlt = {skill.imgAlt}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

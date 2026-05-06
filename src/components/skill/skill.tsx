import style from "./skill.module.css";
import type { Skill } from "../../app/resumeData"

export default function Skill({name, img, imgAlt}: Skill) {
  return (
    <div className={style.skill}>
        <img
            src={img}
            width = {100}
            alt={imgAlt}
        />
        {name}
    </div>
  );
}
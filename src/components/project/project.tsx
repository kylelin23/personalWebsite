import Link from "next/link";
import style from "./project.module.css";
import type {Project} from "../../app/portfolioData"

export default function Project({title, tech, description, image, imageAlt, imageLink, imageWidth}: Project) {
  return (
    <div className = {style.projectContainer}>
        <Link href = {imageLink}>
            <img className = {style.projectImage} src = {image} alt = {imageAlt} width = {imageWidth}/>
        </Link>
        <div className = {style.projectDetails}>
            <p className = {style.projectName}>{title}</p>
            <p className = {style.projectDescription}>
                {description}
            </p>
            <p className = {style.projectDescription}><strong>Technologies Used: </strong>{tech}</p>
            <p>
                <a className = {style.learnMore} href = {imageLink}>Learn More</a>
            </p>
        </div>
    </div>
  );
}
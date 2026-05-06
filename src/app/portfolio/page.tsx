import Link from "next/link";
import style from "./portfolio.module.css"
import Project from "../../components/project/project"
// import projects from "../portfolioData"
import projectSchema from "../../database/projectSchema"
import connectDB from "../../database/db"

async function getProjects(){
    await connectDB() // function from db.ts before

    try {
        // query for all blogs and sort by date
        const blogs = await projectSchema.find().sort({ date: -1 }).orFail()
        // send a response as the blogs as the message
        return blogs
    } catch (err) {
        return null
    }
  }

export default async function Portfolio() {

  const projects = await getProjects() ?? [];

  return (
    <div>
        <div className = {style.gradientContainer}>
            <h1 className = {style.pageTitle}>Portfolio</h1>
        </div>
        <div className = {style.project}>
            {projects.map(project =>
                <Project
                title = {project.title}
                tech = {project.tech}
                description = {project.description}
                image = {project.image}
                imageAlt = {project.imageAlt}
                imageLink = {project.imageLink}
                imageWidth = {project.imageWidth}
                key = {project.key}
                />
            )}
        </div>
    </div>
  );
}

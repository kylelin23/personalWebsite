import mongoose, { Schema } from "mongoose";

// typescript type (can also be an interface)
type Project = {
    title: string;
    tech: string;
    description: string;
    image: string;
    imageAlt: string;
    imageLink: string;
    imageWidth: number;
    key: number;
};


// mongoose schema
const projectSchema = new Schema<Project>({
    title: { type: String, required: true },
    tech: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    imageAlt: { type: String, required: true },
    imageLink: { type: String, required: true },
    imageWidth: { type: Number, required: true },
    key: { type: Number, required: true },
})

// defining the collection and model
const Project = mongoose.models['projects'] ||
    mongoose.model('projects', projectSchema);

export default Project;
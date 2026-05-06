import type { IComment } from "../components/comment/Comment";
import mongoose, { Schema } from "mongoose";

// typescript type (can also be an interface)
type Blog = {
	title: string;
    date: string;
    description: string;
    image: string;
    imageAlt: string;
    comments: IComment[];
    slug: string;
};


const commentSchema = new Schema({
  user: { type: String, required: true },
  comment: { type: String, required: true },
  time: { type: Date, required: true },
});

// mongoose schema
const blogSchema = new Schema<Blog>({
    title: { type: String, required: true },
    date: { type: String, required: true },
	// date: { type: Date, required: false, default: new Date()},
    description: { type: String, required: true },
    image: { type: String, required: true },
    imageAlt: { type: String, required: true },
    comments: {type: [commentSchema], required: true},
    slug: { type: String, required: true },
})

// defining the collection and model
const Blog = mongoose.models['blogs'] ||
    mongoose.model('blogs', blogSchema);

export default Blog;
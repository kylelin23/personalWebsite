import type { IComment } from "../components/comment/Comment";
import mongoose, { Schema } from "mongoose";

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

const blogSchema = new Schema<Blog>({
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  imageAlt: { type: String, required: true },
  comments: { type: [commentSchema], required: true },
  slug: { type: String, required: true },
});

const Blog = mongoose.models["blogs"] || mongoose.model("blogs", blogSchema);

export default Blog;

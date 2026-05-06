"use client";

import style from './blogPreview.module.css'
// import type { Blog } from '../../app/blogData'
import Comment from '../comment/Comment';
import type { IComment } from '../comment/Comment'
import { useState } from 'react';

type Blog = {
    title: string;
    date: string;
    description: string;
    image: string;
    imageAlt: string;
    comments: IComment[];
    slug: string;
}

export default function BlogPreview({ title, date, description, image, imageAlt, comments, slug }: Blog) {

  const [localComments, setLocalComments] = useState(comments);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);

    const form = document.getElementById("contact-form") as HTMLFormElement | null;

    if (!form) {
      console.error("Form not found");
      return;
    }

    const formData = new FormData(form);
    const name = formData.get("name") as string | null;
    const comment = formData.get("comment") as string | null;

    if (!name || !comment) {
      setError("Please fill out both fields.");
      return;
    }

    try {
      // setIsSubmitting(true);

      const res = await fetch(`/api/blog/${slug}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: name, comment }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Failed to submit comment.");
        return;
      }

      const updatedBlog = await res.json();

      if (updatedBlog?.comments) {
        setLocalComments(updatedBlog.comments);
      } else {
        setLocalComments((prev) => [
          ...prev,
          {
            user: name,
            comment,
            time: new Date(),
          } as IComment,
        ]);
      }

      form.reset();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      // setIsSubmitting(false);
    }
  };

  return (
    <div className = {style.blog}>
        <div className = {style.schoolContainer}>
            <p className = {style.blogTitle}>{title}</p>
            <p className = {style.blogText}><strong>{date}</strong></p>
            <p className = {style.blogText}>{description}</p>
            <img className = {style.blogImage} src = {image} alt = {imageAlt} width = {200}></img>
            <div className = {style.commentTitle}>Comments: </div>
            <div className = {style.errorText}>{error}</div>
            <form id="contact-form">
              <input
                className={style.input}
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                required
              />
              <br /><br />
              <textarea
                className={style.input}
                id="comment"
                name="comment"
                placeholder="Comment"
                required
              />
              <br /><br />
              <input
                className={style.submit}
                type="submit"
                value="Submit"
                onClick = {handleClick}
              />
            </form>
            <Comment
              comments = {localComments}
            />
        </div>
    </div>
  );
}
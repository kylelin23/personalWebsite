"use client";

import Comment from "../comment/Comment";
import type { IComment } from "../comment/Comment";
import { useState } from "react";
import styles from "./blogPreview.module.css";

type Blog = {
  title: string;
  date: string;
  description: string;
  image: string;
  imageAlt: string;
  comments: IComment[];
  slug: string;
};

export default function BlogPreview({
  title,
  date,
  description,
  image,
  imageAlt,
  comments,
  slug,
}: Blog) {
  const [localComments, setLocalComments] = useState(comments);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const form = document.getElementById(
      "contact-form",
    ) as HTMLFormElement | null;
    if (!form) return;

    const formData = new FormData(form);
    const name = formData.get("name") as string | null;
    const comment = formData.get("comment") as string | null;

    if (!name || !comment) {
      setError("Please fill out both fields.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`/api/blog/${slug}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          { user: name, comment, time: new Date().toISOString() } as IComment,
        ]);
      }
      setSuccess(true);
      form.reset();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {date && <p className={styles.date}>{date}</p>}

      {image && (
        <div className={styles.imageWrap}>
          <img src={image} alt={imageAlt} className={styles.image} />
        </div>
      )}

      <div className={styles.description}>
        {description.split("\n").map((para, i) =>
          para.trim() ? (
            <p key={i} className={styles.paragraph}>
              {para}
            </p>
          ) : (
            <div key={i} className={styles.paragraphSpacer} />
          ),
        )}
      </div>

      <div className={styles.divider}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerStar}>✦</span>
        <div className={styles.dividerLine} />
      </div>

      <div className={styles.commentsHeader}>
        <h3 className={styles.commentsTitle}>Comments</h3>
        <span className={styles.commentsCount}>
          {localComments?.length ?? 0}
        </span>
      </div>

      <div className={styles.formCard}>
        <p className={styles.formHint}>Leave a comment</p>
        <form id="contact-form">
          <div className={styles.nameFieldWrap}>
            <label className={styles.blogLabel} htmlFor="name">
              Name
            </label>
            <input
              className={styles.blogInput}
              type="text"
              id="name"
              name="name"
              placeholder="Your name..."
              required
            />
          </div>
          <div className={styles.commentFieldWrap}>
            <label className={styles.blogLabel} htmlFor="comment">
              Comment
            </label>
            <textarea
              className={styles.blogInput}
              id="comment"
              name="comment"
              placeholder="Share your thoughts..."
              rows={4}
              required
            />
          </div>
          {error && <div className={styles.errorBox}>⚠ {error}</div>}
          {success && (
            <div className={styles.successBox}>✓ Comment posted!</div>
          )}
          <button
            className={styles.blogSubmit}
            type="button"
            onClick={handleClick}
            disabled={sending}
          >
            {sending ? "Posting..." : "Post Comment"}
          </button>
        </form>
      </div>

      <Comment comments={localComments} />
    </div>
  );
}

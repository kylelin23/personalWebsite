import styles from "./comment.module.css";

export type IComment = {
  user: string;
  comment: string;
  time: Date | string;
};

type CommentProps = {
  comments: IComment[];
};

function parseCommentTime(time: Date | string) {
  if (!time) return "";
  if (typeof time === "string" && isNaN(Date.parse(time))) return time;
  try {
    return new Date(time).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return String(time);
  }
}

function Comment({ comments }: CommentProps) {
  if (!comments || comments.length === 0) {
    return (
      <div className={styles.emptyState}>No comments yet. Be the first!</div>
    );
  }

  return (
    <div className={styles.list}>
      {comments.map((comment, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.user}>{comment.user}</span>
            <span className={styles.time}>
              {parseCommentTime(comment.time)}
            </span>
          </div>
          <p className={styles.text}>{comment.comment}</p>
        </div>
      ))}
    </div>
  );
}

export default Comment;

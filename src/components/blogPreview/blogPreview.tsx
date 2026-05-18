"use client";

import Comment from '../comment/Comment';
import type { IComment } from '../comment/Comment';
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
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const form = document.getElementById("contact-form") as HTMLFormElement | null;
    if (!form) return;

    const formData = new FormData(form);
    const name = formData.get("name") as string | null;
    const comment = formData.get("comment") as string | null;

    if (!name || !comment) { setError("Please fill out both fields."); return; }

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
        setLocalComments(prev => [...prev, { user: name, comment, time: new Date().toISOString() } as IComment]);
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
    <div style={{fontFamily:'Georgia,serif',color:'#f5e6c0'}}>
      <style>{`
        .blog-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(200,160,70,.22);border-radius:8px;padding:11px 14px;color:#f5e6c0;font-family:Georgia,serif;font-size:13px;outline:none;transition:border-color 0.2s ease,box-shadow 0.2s ease;resize:none;box-sizing:border-box;}
        .blog-input::placeholder{color:rgba(200,168,112,.3);}
        .blog-input:focus{border-color:rgba(200,160,70,.6);box-shadow:0 0 14px rgba(200,160,70,.1);}
        .blog-label{font-size:10px;letter-spacing:2.5px;color:rgba(200,160,80,.55);text-transform:uppercase;margin-bottom:6px;display:block;}
        .blog-submit{width:100%;background:transparent;border:1.5px solid #c8a870;border-radius:4px;color:#f5e6c0;font-family:Georgia,serif;font-size:12px;letter-spacing:4px;padding:13px;cursor:pointer;text-transform:uppercase;transition:all 0.2s ease;}
        .blog-submit:hover:not(:disabled){background:rgba(200,160,70,.12);box-shadow:0 0 20px rgba(200,160,70,.2);}
        .blog-submit:disabled{opacity:0.45;cursor:not-allowed;}
      `}</style>

      {/* Date */}
      {date && (
        <p style={{fontSize:10,letterSpacing:3,color:'rgba(200,160,80,0.55)',textTransform:'uppercase',margin:'0 0 24px'}}>
          {date}
        </p>
      )}

      {/* Image — small and centered */}
      {image && (
        <div style={{marginBottom:32,textAlign:'center'}}>
          <img src={image} alt={imageAlt} style={{width:220,borderRadius:10,border:'1px solid rgba(200,160,70,.15)',display:'inline-block'}}/>
        </div>
      )}

      {/* Body text — split on newlines for paragraphs */}
      <div style={{marginBottom:40}}>
        {description.split('\n').map((para, i) =>
          para.trim()
            ? <p key={i} style={{fontSize:15,lineHeight:2.0,color:'rgba(220,200,160,0.85)',margin:'0 0 20px',letterSpacing:0.3}}>{para}</p>
            : <div key={i} style={{height:6}}/>
        )}
      </div>

      {/* Divider */}
      <div style={{display:'flex',alignItems:'center',gap:12,margin:'8px 0 36px'}}>
        <div style={{flex:1,height:1,background:'rgba(200,160,70,.12)'}}/>
        <span style={{fontSize:12,color:'rgba(200,160,80,0.3)'}}>✦</span>
        <div style={{flex:1,height:1,background:'rgba(200,160,70,.12)'}}/>
      </div>

      {/* Comments header */}
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
        <h3 style={{fontSize:'0.85rem',fontWeight:'bold',letterSpacing:3,textTransform:'uppercase',color:'rgba(200,160,80,0.65)',margin:0}}>Comments</h3>
        <span style={{fontSize:11,color:'rgba(200,160,80,0.35)',background:'rgba(200,160,70,.08)',border:'1px solid rgba(200,160,70,.15)',borderRadius:12,padding:'1px 10px'}}>
          {localComments?.length ?? 0}
        </span>
      </div>

      {/* Comment form */}
      <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(200,160,70,.1)',borderRadius:12,padding:'24px',marginBottom:28}}>
        <p style={{fontSize:10,letterSpacing:2,color:'rgba(200,160,80,0.45)',textTransform:'uppercase',margin:'0 0 18px'}}>Leave a comment</p>
        <form id="contact-form">
          <div style={{marginBottom:12}}>
            <label className="blog-label" htmlFor="name">Name</label>
            <input className="blog-input" type="text" id="name" name="name" placeholder="Your name..." required/>
          </div>
          <div style={{marginBottom:14}}>
            <label className="blog-label" htmlFor="comment">Comment</label>
            <textarea className="blog-input" id="comment" name="comment" placeholder="Share your thoughts..." rows={4} required/>
          </div>
          {error && (
            <div style={{background:'rgba(255,80,80,.07)',border:'1px solid rgba(255,80,80,.18)',borderRadius:6,padding:'8px 12px',color:'#ff9090',fontSize:12,marginBottom:12}}>
              ⚠ {error}
            </div>
          )}
          {success && (
            <div style={{background:'rgba(80,200,80,.07)',border:'1px solid rgba(80,200,80,.18)',borderRadius:6,padding:'8px 12px',color:'#80e890',fontSize:12,marginBottom:12}}>
              ✓ Comment posted!
            </div>
          )}
          <button className="blog-submit" type="button" onClick={handleClick} disabled={sending}>
            {sending ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>

      {/* Existing comments */}
      <Comment comments={localComments}/>
    </div>
  );
}
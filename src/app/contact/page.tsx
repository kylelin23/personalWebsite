"use client"
import { useState } from "react";
import Link from "next/link";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_kz9xcfa";
const TEMPLATE_ID_1 = "template_mbh71i3";
const TEMPLATE_ID_2 = "template_zpr05bs";
const PUBLIC_KEY = "kha2bU1tDlmvdOBEj";

export default function Contact() {
  const [error, setError] = useState<null|string>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = document.getElementById("contact-form") as HTMLFormElement|null;
    if (!form) return;
    const data = new FormData(form);
    if (!data.get("name") || !data.get("email") || !data.get("message")) {
      setError("Please fill out all fields.");
      return;
    }
    setSending(true);
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID_1, form, PUBLIC_KEY);
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID_2, form, PUBLIC_KEY);
      setSent(true);
      setError(null);
      form.reset();
    } catch(err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#050c18',fontFamily:'Georgia,serif',color:'#f5e6c0',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 20px',position:'relative',overflow:'hidden'}}>

      {/* Back link — top left */}
      <div style={{position:'fixed',top:20,left:24,zIndex:10}}>
        <Link className="back-link" href="/?go=game">← Back to the Sea</Link>
      </div>

      {/* Ocean line background */}
      <div style={{position:'absolute',inset:0,opacity:0.08,background:'repeating-linear-gradient(0deg,transparent,transparent 48px,rgba(80,150,240,0.5) 48px,rgba(80,150,240,0.5) 50px)',pointerEvents:'none'}}/>

      {/* Floating ambient dots */}
      {Array.from({length:8}).map((_,i)=>(
        <div key={i} style={{position:'absolute',width:2,height:2,borderRadius:'50%',background:'rgba(200,168,100,0.3)',top:`${12+i*10}%`,left:`${8+i*11}%`,animation:`pulse2 ${2.5+i*0.4}s ease-in-out infinite alternate`,pointerEvents:'none'}}/>
      ))}

      <style>{`
        @keyframes pulse2{0%{opacity:0.1;transform:scale(1)}100%{opacity:0.6;transform:scale(1.8)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{text-shadow:0 0 20px rgba(200,160,80,.2)}50%{text-shadow:0 0 40px rgba(200,160,80,.6)}}
        .contact-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(200,160,70,.25);border-radius:8px;padding:12px 16px;color:#f5e6c0;font-family:Georgia,serif;font-size:14px;outline:none;transition:border-color 0.2s ease,box-shadow 0.2s ease;resize:none;box-sizing:border-box;}
        .contact-input::placeholder{color:rgba(200,168,112,.35);}
        .contact-input:focus{border-color:rgba(200,160,70,.6);box-shadow:0 0 16px rgba(200,160,70,.12);}
        .contact-label{font-size:11px;letter-spacing:3px;color:rgba(200,160,80,.6);text-transform:uppercase;margin-bottom:8px;display:block;}
        .submit-btn{width:100%;background:transparent;border:2px solid #c8a870;border-radius:4px;color:#f5e6c0;font-family:Georgia,serif;font-size:14px;letter-spacing:4px;padding:14px;cursor:pointer;text-transform:uppercase;transition:all 0.2s ease;margin-top:8px;}
        .submit-btn:hover:not(:disabled){background:rgba(200,160,70,.12);box-shadow:0 0 24px rgba(200,160,70,.25);}
        .submit-btn:disabled{opacity:0.5;cursor:not-allowed;}
        .footer-link{color:rgba(200,160,80,.45);font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;transition:color 0.2s ease;}
        .footer-link:hover{color:#c8a870;}
        .back-link{color:rgba(200,160,80,.6);font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;transition:color 0.2s ease;}
        .back-link:hover{color:#c8a870;}
      `}</style>

      <div style={{position:'relative',zIndex:2,width:'100%',maxWidth:520,animation:'fadeUp 0.7s ease forwards'}}>

        {/* Header */}
        <div style={{textAlign:'center',marginBottom:40}}>
          <div style={{fontSize:40,marginBottom:12}}>⚓</div>
          <h1 style={{fontSize:'2rem',fontWeight:'bold',margin:'0 0 8px',letterSpacing:2,animation:'glow 3s ease-in-out infinite'}}>Contact</h1>
          <p style={{color:'rgba(200,160,80,.5)',fontSize:11,letterSpacing:3,textTransform:'uppercase',margin:0}}>Send a message to me!</p>
        </div>

        {/* Form card */}
        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(200,160,70,.15)',borderRadius:16,padding:'36px 40px',backdropFilter:'blur(12px)'}}>
          {sent ? (
            <div style={{textAlign:'center',padding:'20px 0'}}>
              <h2 style={{color:'#80ff90',margin:'0 0 8px',fontSize:'1.3rem'}}>Message Sent!</h2>
              <p style={{color:'rgba(200,168,112,.6)',fontSize:13,margin:'0 0 24px'}}>Your message has been sent. I'll respond soon!</p>
              <button className="submit-btn" onClick={()=>setSent(false)} style={{width:'auto',padding:'10px 32px'}}>Send Another</button>
            </div>
          ) : (
            <form id="contact-form">
              <div style={{marginBottom:22}}>
                <label className="contact-label" htmlFor="name">Your Name</label>
                <input className="contact-input" type="text" id="name" name="name" placeholder="Captain..."/>
              </div>

              <div style={{marginBottom:22}}>
                <label className="contact-label" htmlFor="email">Email Address</label>
                <input className="contact-input" type="email" id="email" name="email" placeholder="example@example.com"/>
              </div>

              <div style={{marginBottom:28}}>
                <label className="contact-label" htmlFor="message">Message</label>
                <textarea className="contact-input" id="message" name="message" placeholder="Write your message..." rows={5}/>
              </div>

              {error && (
                <div style={{background:'rgba(255,80,80,.08)',border:'1px solid rgba(255,80,80,.2)',borderRadius:6,padding:'10px 14px',color:'#ff9090',fontSize:12,marginBottom:16,letterSpacing:1}}>
                  ⚠ {error}
                </div>
              )}

              <button className="submit-btn" type="button" onClick={handleClick} disabled={sending} style={{marginTop:20}}>
                {sending ? 'Sending...' : '⚓ Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* Footer links */}
        <div style={{textAlign:'center',marginTop:28,display:'flex',justifyContent:'center',gap:28}}>
          <Link className="footer-link" href="https://www.linkedin.com/in/kyle-lin-584235295/" target="_blank" rel="noreferrer">LinkedIn</Link>
          <Link className="footer-link" href="https://github.com/kylelin23" target="_blank" rel="noreferrer">GitHub</Link>
          <Link className="footer-link" href="mailto:linkyle0924@gmail.com">Email</Link>
        </div>
      </div>
    </div>
  );
}
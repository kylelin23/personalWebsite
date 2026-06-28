"use client";

import Link from "next/link";

export default function Contact() {
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

        .social-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(200, 160, 70, .25);
          border-radius: 8px;
          padding: 14px 20px;
          color: #f5e6c0;
          text-decoration: none;
          font-family: Georgia, serif;
          font-size: 15px;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
          margin-bottom: 16px;
        }
        .social-card:last-child {
          margin-bottom: 0;
        }
        .social-card:hover {
          background: rgba(200, 160, 70, .12);
          border-color: rgba(200, 160, 70, .6);
          box-shadow: 0 0 16px rgba(200, 160, 70, .12);
        }
        .social-icon {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }
        .back-link{color:rgba(200,160,80,.6);font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;transition:color 0.2s ease;}
        .back-link:hover{color:#c8a870;}
      `}</style>

      <div style={{position:'relative',zIndex:2,width:'100%',maxWidth:450,animation:'fadeUp 0.7s ease forwards'}}>

        {/* Header */}
        <div style={{textAlign:'center',marginBottom:40}}>
          <div style={{fontSize:40,marginBottom:12}}>⚓</div>
          <h1 style={{fontSize:'2rem',fontWeight:'bold',margin:'0 0 8px',letterSpacing:2,animation:'glow 3s ease-in-out infinite'}}>Contact</h1>
          <p style={{color:'rgba(200,160,80,.5)',fontSize:11,letterSpacing:3,textTransform:'uppercase',margin:0}}>Connect with me here!</p>
        </div>

        {/* Links Card container */}
        <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(200,160,70,.15)',borderRadius:16,padding:'32px',backdropFilter:'blur(12px)'}}>

          {/* LinkedIn */}
          <Link
            className="social-card"
            href="https://www.linkedin.com/in/kyle-lin-584235295/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="social-icon"
              src="/assets/logos/LI-In-Bug.png"
              alt="LinkedIn Logo"
            />
            <span>LinkedIn</span>
          </Link>

          {/* GitHub */}
          <Link
            className="social-card"
            href="https://github.com/kylelin23"
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="social-icon" 
              src="/assets/logos/githubLogo.png"
              alt="GitHub Logo"
            />
            <span>GitHub</span>
          </Link>

          {/* Email */}
          <Link
            className="social-card"
            href="mailto:linkyle0924@gmail.com"
          >
            <img
              className="social-icon"
              src="/assets/logos/gmailIcon.webp"
              alt="Gmail Logo"
            />
            <span>Email</span>
          </Link>

        </div>
      </div>
    </div>
  );
}
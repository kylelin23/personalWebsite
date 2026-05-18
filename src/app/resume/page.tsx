import Link from "next/link";
import Skill from "../../components/skill/skill";
import { programmingLanguages, developerTools, frameworks, certifications } from "../resumeData";

export default function Resume() {
  return (
    <div style={{minHeight:'100vh',background:'#050c18',fontFamily:'Georgia,serif',color:'#f5e6c0',position:'relative',overflow:'hidden'}}>

      {/* Back link */}
      <div style={{position:'fixed',top:20,left:24,zIndex:10}}>
        <Link href="/?go=game" className="back-link">← Back to the Sea</Link>
      </div>

      {/* Ocean line background */}
      <div style={{position:'fixed',inset:0,opacity:0.08,background:'repeating-linear-gradient(0deg,transparent,transparent 48px,rgba(80,150,240,0.5) 48px,rgba(80,150,240,0.5) 50px)',pointerEvents:'none',zIndex:0}}/>

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{text-shadow:0 0 20px rgba(200,160,80,.2)}50%{text-shadow:0 0 40px rgba(200,160,80,.6)}}
        @keyframes cardIn{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        .back-link{color:rgba(200,160,80,.6);font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;transition:color 0.2s ease;}
        .back-link:hover{color:#c8a870;}
        .footer-back{color:rgba(200,160,80,.6);font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;transition:color 0.2s ease;}
        .footer-back:hover{color:#c8a870;}
        .resume-card{background:rgba(255,255,255,0.03);border:1px solid rgba(200,160,70,.15);border-radius:14px;padding:32px 36px;margin-bottom:24px;animation:cardIn 0.5s ease both;}
        .school-card{display:flex;gap:28px;align-items:flex-start;}
        .section-title{font-size:10px;letter-spacing:4px;color:rgba(200,160,80,.55);text-transform:uppercase;margin:0 0 20px;display:flex;align-items:center;gap:12px;}
        .section-title::after{content:'';flex:1;height:1px;background:rgba(200,160,70,.15);}
        .school-name{font-size:1.05rem;font-weight:bold;color:#f5e6c0;margin:0 0 10px;letter-spacing:0.5px;}
        .school-detail{font-size:13px;line-height:1.8;color:rgba(200,168,112,0.7);margin:0 0 6px;}
        .school-detail strong{color:rgba(200,168,112,0.95);}
        .skill-group-title{font-size:10px;letter-spacing:3px;color:rgba(200,160,80,.5);text-transform:uppercase;margin:24px 0 14px;}
        .skill-group-title:first-of-type{margin-top:0;}
        .skills-grid{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:8px;}
        .download-btn{display:inline-block;background:transparent;border:1.5px solid #c8a870;border-radius:4px;color:#f5e6c0;font-family:Georgia,serif;font-size:12px;letter-spacing:4px;padding:13px 36px;text-decoration:none;text-transform:uppercase;transition:all 0.2s ease;}
        .download-btn:hover{background:rgba(200,160,70,.12);box-shadow:0 0 24px rgba(200,160,70,.25);}
        @media(max-width:600px){.school-card{flex-direction:column;}.school-card img{width:100%!important;}}
      `}</style>

      <div style={{position:'relative',zIndex:1,maxWidth:860,margin:'0 auto',padding:'100px 24px 80px'}}>

        {/* Header */}
        <div style={{textAlign:'center',marginBottom:56,animation:'fadeUp 0.6s ease forwards'}}>
          <h1 style={{fontSize:'2.8rem',fontWeight:'bold',margin:'0 0 10px',letterSpacing:3,animation:'glow 3s ease-in-out infinite'}}>
            Resume
          </h1>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,marginTop:16,marginBottom:28}}>
            <div style={{width:60,height:1,background:'linear-gradient(to right,transparent,rgba(200,160,80,0.4))'}}/>
            <div style={{fontSize:13,color:'rgba(200,160,80,0.5)'}}>✦</div>
            <div style={{width:60,height:1,background:'linear-gradient(to left,transparent,rgba(200,160,80,0.4))'}}/>
          </div>
          <Link href="assets/resume.pdf" className="download-btn">
            Download Resume
          </Link>
        </div>

        {/* Education */}
        <div className="resume-card" style={{animationDelay:'0.1s'}}>
          <p className="section-title">Education</p>

          {/* Cal Poly */}
          <div className="school-card" style={{marginBottom:32}}>
            <img src="assets/logos/calPolyLogo.jpg" alt="Cal Poly Logo" width={120}
              style={{borderRadius:8,border:'1px solid rgba(200,160,70,.15)',flexShrink:0,objectFit:'cover'}}/>
            <div>
              <p className="school-name">California Polytechnic State University, San Luis Obispo</p>
              <p className="school-detail"><strong>Degree: </strong>Bachelor of Science, Computer Science</p>
              <p className="school-detail"><strong>Expected Graduation: </strong>May 2027</p>
              <p className="school-detail"><strong>Coursework: </strong>Data Structures, Intro to Computer Organization, Object Oriented Programming, Discrete Structures, Systems Programming, Design and Analysis of Algorithms, Intro to Database Systems</p>
              <p className="school-detail"><strong>Relevant Projects: </strong>Adventure game in Java using polymorphism and class inheritance; rental review app with React, Express, and MongoDB</p>
            </div>
          </div>

          {/* Divider */}
          <div style={{height:1,background:'rgba(200,160,70,.1)',margin:'4px 0 28px'}}/>

          {/* NTU */}
          <div className="school-card">
            <img src="assets/logos/ntuLogo.jpeg" alt="NTU Logo" width={120}
              style={{borderRadius:8,border:'1px solid rgba(200,160,70,.15)',flexShrink:0,objectFit:'cover'}}/>
            <div>
              <p className="school-name">Nanyang Technological University</p>
              <p className="school-detail"><strong>Term: </strong>Summer 2025 Study Abroad</p>
              <p className="school-detail"><strong>Coursework: </strong>Cybersecurity — cyberattacks and encryption algorithms</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="resume-card" style={{animationDelay:'0.2s'}}>
          <p className="section-title">Skills</p>

          <p className="skill-group-title">Programming Languages</p>
          <div className="skills-grid">
            {programmingLanguages.map(skill =>
              <Skill key={skill.key} name={skill.name} img={skill.img} imgAlt={skill.imgAlt}/>
            )}
          </div>

          <p className="skill-group-title">Frameworks</p>
          <div className="skills-grid">
            {frameworks.map(skill =>
              <Skill key={skill.key} name={skill.name} img={skill.img} imgAlt={skill.imgAlt}/>
            )}
          </div>

          <p className="skill-group-title">Developer Tools</p>
          <div className="skills-grid">
            {developerTools.map(skill =>
              <Skill key={skill.key} name={skill.name} img={skill.img} imgAlt={skill.imgAlt}/>
            )}
          </div>

          <p className="skill-group-title">Certifications</p>
          <div className="skills-grid">
            {certifications.map(skill =>
              <Skill key={skill.key} name={skill.name} img={skill.img} imgAlt={skill.imgAlt}/>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{textAlign:'center',marginTop:32,paddingTop:32,borderTop:'1px solid rgba(200,160,70,.1)'}}>
          <Link href="/?go=game" className="footer-back">← Back to the Sea</Link>
        </div>
      </div>
    </div>
  );
}
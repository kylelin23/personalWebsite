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
        .entry-top{display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap;}
        .entry-date{font-size:12px;color:rgba(200,168,112,0.6);white-space:nowrap;letter-spacing:0.5px;}
        .entry-sub{display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap;margin:2px 0 10px;}
        .entry-org{font-style:italic;font-size:13px;color:rgba(200,168,112,0.8);margin:0;}
        .entry-loc{font-style:italic;font-size:12px;color:rgba(200,168,112,0.5);margin:0;white-space:nowrap;}
        .entry-bullets{margin:0;padding-left:20px;}
        .entry-bullets li{font-size:13px;line-height:1.75;color:rgba(200,168,112,0.7);margin-bottom:5px;}
        .entry-bullets li::marker{color:rgba(200,160,80,.5);}
        .portfolio-card{background:rgba(255,255,255,0.03);border:1px solid rgba(200,160,70,.18);border-radius:16px;padding:32px;transition:border-color 0.25s ease,box-shadow 0.25s ease,transform 0.25s ease;display:flex;gap:32px;align-items:flex-start;}
        .portfolio-card:hover{border-color:rgba(200,160,70,.5);box-shadow:0 0 40px rgba(200,160,70,.1);transform:translateY(-3px);}
        .tech-badge{display:inline-block;background:rgba(200,160,70,.1);border:1px solid rgba(200,160,70,.25);border-radius:20px;padding:3px 12px;font-size:11px;letter-spacing:1px;color:rgba(200,168,112,.8);margin:3px;}
        .proj-link{color:rgba(200,160,80,.6);font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;transition:color 0.2s ease;border-bottom:1px solid rgba(200,160,80,.2);padding-bottom:1px;}
        .proj-link:hover{color:#c8a870;border-bottom-color:#c8a870;}
        @media(max-width:600px){.school-card{flex-direction:column;}.school-card img{width:100%!important;}.entry-top,.entry-sub{flex-direction:column;align-items:flex-start;gap:2px;}}
        @media(max-width:640px){.portfolio-card{flex-direction:column;}.card-image{width:100%!important;min-width:unset!important;}}
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
          <div className="school-card">
            <img src="assets/logos/calPolyLogo.jpg" alt="Cal Poly Logo" width={120}
              style={{borderRadius:8,border:'1px solid rgba(200,160,70,.15)',flexShrink:0,objectFit:'cover'}}/>
            <div>
              <p className="school-name">California Polytechnic State University, San Luis Obispo</p>
              <p className="school-detail"><strong>Degree: </strong>Bachelor of Science, Computer Science</p>
              <p className="school-detail"><strong>Expected Graduation: </strong>May 2027</p>
              <p className="school-detail"><strong>Coursework: </strong>Data Structures and Algorithms, Databases, Full-Stack Development, Artificial Intelligence, Data Science, Object-Oriented Programming, Programming Languages</p>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div style={{marginBottom:24}}>
          <p className="section-title">Experience</p>
          <div style={{display:'flex',flexDirection:'column',gap:24}}>

            {/* Paso Food Co-op */}
            <div className="portfolio-card" style={{animation:'cardIn 0.5s ease 0.05s both'}}>
              <div className="card-image" style={{minWidth:180,width:180,flexShrink:0}}>
                <a href="https://prfc-connect.vercel.app/dev/mock-portal" target="_blank" rel="noreferrer">
                  <img src="/assets/logos/hack4ImpactScreenshot.png" alt="Hack4Impact Paso Food Co-op project screenshot"
                    style={{width:'100%',borderRadius:10,border:'1px solid rgba(200,160,70,.2)',display:'block'}}/>
                </a>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div className="entry-top">
                  <h2 style={{fontSize:'1.25rem',fontWeight:'bold',margin:0,letterSpacing:1}}>
                    <a href="https://prfc-connect.vercel.app/dev/mock-portal" target="_blank" rel="noreferrer" style={{color:'#f5e6c0',textDecoration:'none'}}>Full Stack Developer for Paso Food Co-op</a>
                  </h2>
                  <p className="entry-date">September 2025 – June 2026</p>
                </div>
                <div className="entry-sub">
                  <p className="entry-org">Hack4Impact at California Polytechnic State University</p>
                </div>
                <div style={{marginBottom:14,flexWrap:'wrap',display:'flex'}}>
                  {['Node.js','React','MongoDB'].map(t => <span key={t} className="tech-badge">{t}</span>)}
                </div>
                <ul className="entry-bullets" style={{marginBottom:18}}>
                  <li>Developed a full stack website for a 400-member food co-op using Node.js, React, and MongoDB in a team of 12</li>
                  <li>Participated in Agile development, including code reviews and sprint planning</li>
                  <li>Implemented CRUD operations and RESTful APIs to support authentication, real-time messaging, and event scheduling</li>
                </ul>
                <a href="https://prfc-connect.vercel.app/dev/mock-portal" target="_blank" rel="noreferrer" className="proj-link">View Project →</a>
              </div>
            </div>

            {/* Neighborhood House Association */}
            <div className="portfolio-card" style={{animation:'cardIn 0.5s ease 0.1s both'}}>
              <div className="card-image" style={{minWidth:180,width:180,flexShrink:0}}>
                <a href="https://ehs-learning-library-pb25.onrender.com/" target="_blank" rel="noreferrer">
                  <img src="/assets/EHSProjectScreenshot.png" alt="Neighborhood House Association educator resource website screenshot"
                    style={{width:'100%',borderRadius:10,border:'1px solid rgba(200,160,70,.2)',display:'block'}}/>
                </a>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div className="entry-top">
                  <h2 style={{fontSize:'1.25rem',fontWeight:'bold',margin:0,letterSpacing:1}}>
                    <a href="https://ehs-learning-library-pb25.onrender.com/" target="_blank" rel="noreferrer" style={{color:'#f5e6c0',textDecoration:'none'}}>Frontend Developer Intern</a>
                  </h2>
                  <p className="entry-date">July 2025 – September 2025</p>
                </div>
                <div className="entry-sub">
                  <p className="entry-org">Neighborhood House Association</p>
                  <p className="entry-loc">Remote</p>
                </div>
                <div style={{marginBottom:14,flexWrap:'wrap',display:'flex'}}>
                  {['React'].map(t => <span key={t} className="tech-badge">{t}</span>)}
                </div>
                <ul className="entry-bullets" style={{marginBottom:18}}>
                  <li>Led a team of 4 engineers as a project lead to develop a website used by real educators, consolidating resources from 6+ external sources into a single searchable website</li>
                  <li>Built dynamic features such as search and filtering in React, greatly reducing the time required for educators to locate relevant educational resources</li>
                  <li>Planned weekly sprints and code reviews, mentored a junior developer in React, and improved team development workflow and collaboration by leading weekly team meetings</li>
                </ul>
                <a href="https://ehs-learning-library-pb25.onrender.com/" target="_blank" rel="noreferrer" className="proj-link">View Project →</a>
              </div>
            </div>

          </div>
        </div>

        {/* Projects */}
        <div style={{marginBottom:24}}>
          <p className="section-title">Projects</p>
          <div style={{display:'flex',flexDirection:'column',gap:24}}>

            {/* CatWise */}
            <div className="portfolio-card" style={{animation:'cardIn 0.5s ease 0.05s both'}}>
              <div className="card-image" style={{minWidth:180,width:180,flexShrink:0}}>
                <a href="https://github.com/kylelin23/catAdoptionApp" target="_blank" rel="noreferrer">
                  <img src="/assets/catAdoptionAppScreenshot.png" alt="CatWise app screenshot"
                    style={{width:'100%',borderRadius:10,border:'1px solid rgba(200,160,70,.2)',display:'block'}}/>
                </a>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <h2 style={{fontSize:'1.25rem',fontWeight:'bold',margin:'0 0 12px',letterSpacing:1}}>
                  <a href="https://github.com/kylelin23/catAdoptionApp" target="_blank" rel="noreferrer" style={{color:'#f5e6c0',textDecoration:'none'}}>CatWise</a>
                </h2>
                <div className="entry-sub" style={{margin:'0 0 10px'}}>
                  <p className="entry-org">iOS Mobile Application | React Native</p>
                </div>
                <div style={{marginBottom:14,flexWrap:'wrap',display:'flex'}}>
                  {['React Native','Supabase'].map(t => <span key={t} className="tech-badge">{t}</span>)}
                </div>
                <ul className="entry-bullets" style={{marginBottom:18}}>
                  <li>Designed and developed a mobile application using React Native to help new cat adopters through personalized content delivery</li>
                  <li>Engineered a clean UI design with custom spring and timing animations, gesture-based swipe navigation, animated progress indicators, and reusable card components across 20+ screens</li>
                  <li>Built Supabase-backed APIs to enable users to create, store, and share adoption experiences</li>
                  <li>Built a location-based shelter finder that displays nearby cat shelters using the user's real-time location</li>
                </ul>
                <a href="https://github.com/kylelin23/catAdoptionApp" target="_blank" rel="noreferrer" className="proj-link">View on GitHub →</a>
              </div>
            </div>

            {/* Personal Website */}
            <div className="portfolio-card" style={{animation:'cardIn 0.5s ease 0.1s both'}}>
              <div className="card-image" style={{minWidth:180,width:180,flexShrink:0}}>
                <Link href="/?go=game">
                  <img src="/assets/personal-website.png" alt="Personal portfolio website screenshot"
                    style={{width:'100%',borderRadius:10,border:'1px solid rgba(200,160,70,.2)',display:'block'}}/>
                </Link>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <h2 style={{fontSize:'1.25rem',fontWeight:'bold',margin:'0 0 12px',letterSpacing:1}}>
                  <Link href="/?go=game" style={{color:'#f5e6c0',textDecoration:'none'}}>Personal Website</Link>
                </h2>
                <div className="entry-sub" style={{margin:'0 0 10px'}}>
                  <p className="entry-org">Full-Stack Website | React and MongoDB</p>
                </div>
                <div style={{marginBottom:14,flexWrap:'wrap',display:'flex'}}>
                  {['React','Next.js','MongoDB'].map(t => <span key={t} className="tech-badge">{t}</span>)}
                </div>
                <ul className="entry-bullets" style={{marginBottom:18}}>
                  <li>Designed and developed a full-stack personal portfolio website with an interactive map game that rendered 20+ animated entities</li>
                  <li>Implemented a physics-based pathing system, enabling entities to autonomously navigate obstacles in real time</li>
                  <li>Developed RESTful APIs using Next.js API routes and MongoDB to dynamically deliver blog posts, projects, and comments, enabling real-time comment submissions.</li>
                </ul>
                <Link href="/?go=game" className="proj-link">View Project →</Link>
              </div>
            </div>

          </div>
        </div>


        {/* Skills */}
        <div className="resume-card" style={{animationDelay:'0.25s'}}>
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
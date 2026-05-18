import Link from "next/link";
import projectSchema from "../../database/projectSchema"
import connectDB from "../../database/db"

async function getProjects(){
  try {
    await connectDB();
    const projects = await projectSchema.find();
    return projects;
  } catch (err) {
    console.error('FULL ERROR:', err);
    return [];
  }
}

export default async function Portfolio() {
  const projects = await getProjects() ?? [];

  return (
    <div style={{minHeight:'100vh',background:'#050c18',fontFamily:'Georgia,serif',color:'#f5e6c0',position:'relative',overflow:'hidden'}}>

      {/* Back link */}
      <div style={{position:'fixed',top:20,left:24,zIndex:10}}>
        <Link href="/?go=game" style={{color:'rgba(200,160,80,.6)',fontSize:11,letterSpacing:2,textTransform:'uppercase',textDecoration:'none',transition:'color 0.2s ease'}}
          onMouseEnter={undefined} onMouseLeave={undefined}>
          ← Back to the Sea
        </Link>
      </div>

      {/* Ocean line background */}
      <div style={{position:'fixed',inset:0,opacity:0.08,background:'repeating-linear-gradient(0deg,transparent,transparent 48px,rgba(80,150,240,0.5) 48px,rgba(80,150,240,0.5) 50px)',pointerEvents:'none',zIndex:0}}/>

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{text-shadow:0 0 20px rgba(200,160,80,.2)}50%{text-shadow:0 0 40px rgba(200,160,80,.6)}}
        @keyframes cardIn{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        .portfolio-card{
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(200,160,70,.18);
          border-radius:16px;
          padding:32px;
          transition:border-color 0.25s ease,box-shadow 0.25s ease,transform 0.25s ease;
          display:flex;
          gap:32px;
          align-items:flex-start;
        }
        .portfolio-card:hover{
          border-color:rgba(200,160,70,.5);
          box-shadow:0 0 40px rgba(200,160,70,.1);
          transform:translateY(-3px);
        }
        .tech-badge{
          display:inline-block;
          background:rgba(200,160,70,.1);
          border:1px solid rgba(200,160,70,.25);
          border-radius:20px;
          padding:3px 12px;
          font-size:11px;
          letter-spacing:1px;
          color:rgba(200,168,112,.8);
          margin:3px;
        }
        .proj-link{
          color:rgba(200,160,80,.6);
          font-size:11px;
          letter-spacing:2px;
          text-transform:uppercase;
          text-decoration:none;
          transition:color 0.2s ease;
          border-bottom:1px solid rgba(200,160,80,.2);
          padding-bottom:1px;
        }
        .proj-link:hover{color:#c8a870;border-bottom-color:#c8a870;}
        .back-link{color:rgba(200,160,80,.6);font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;transition:color 0.2s ease;}
        .back-link:hover{color:#c8a870;}
        @media(max-width:640px){
          .portfolio-card{flex-direction:column;}
          .card-image{width:100%!important;min-width:unset!important;}
        }
      `}</style>

      <div style={{position:'relative',zIndex:1,maxWidth:860,margin:'0 auto',padding:'100px 24px 80px'}}>

        {/* Header */}
        <div style={{textAlign:'center',marginBottom:64,animation:'fadeUp 0.6s ease forwards'}}>
          <h1 style={{fontSize:'2.8rem',fontWeight:'bold',margin:'0 0 10px',letterSpacing:3,animation:'glow 3s ease-in-out infinite'}}>
            Portfolio
          </h1>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,marginTop:16}}>
            <div style={{width:60,height:1,background:'linear-gradient(to right,transparent,rgba(200,160,80,0.4))'}}/>
            <div style={{fontSize:13,color:'rgba(200,160,80,0.5)'}}>✦</div>
            <div style={{width:60,height:1,background:'linear-gradient(to left,transparent,rgba(200,160,80,0.4))'}}/>
          </div>

        </div>

        {/* Project cards */}
        {projects.length===0 ? (
          <div style={{textAlign:'center',padding:'60px 0',color:'rgba(200,168,112,0.4)',fontSize:14,letterSpacing:2}}>
            No projects found.
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:24}}>
            {projects.map((project, idx) => (
              <div key={project.key ?? idx}
                className="portfolio-card"
                style={{animation:`cardIn 0.5s ease ${idx*0.1}s both`}}>

                {/* Image */}
                {project.image && (
                  <div className="card-image" style={{minWidth:180,width:180,flexShrink:0}}>
                    {project.imageLink ? (
                      <a href={project.imageLink} target="_blank" rel="noreferrer">
                        <img
                          src={project.image}
                          alt={project.imageAlt ?? project.title}
                          width={project.imageWidth ?? 180}
                          style={{width:'100%',borderRadius:10,border:'1px solid rgba(200,160,70,.2)',display:'block'}}
                        />
                      </a>
                    ) : (
                      <img
                        src={project.image}
                        alt={project.imageAlt ?? project.title}
                        width={project.imageWidth ?? 180}
                        style={{width:'100%',borderRadius:10,border:'1px solid rgba(200,160,70,.2)',display:'block'}}
                      />
                    )}
                  </div>
                )}

                {/* Content */}
                <div style={{flex:1,minWidth:0}}>
                  {/* Title */}
                  <h2 style={{fontSize:'1.25rem',fontWeight:'bold',margin:'0 0 12px',color:'#f5e6c0',letterSpacing:1}}>
                    {project.imageLink ? (
                      <a href={project.imageLink} target="_blank" rel="noreferrer" style={{color:'#f5e6c0',textDecoration:'none'}}>
                        {project.title}
                      </a>
                    ) : project.title}
                  </h2>

                  {/* Tech badges */}
                  {project.tech && (
                    <div style={{marginBottom:14,flexWrap:'wrap',display:'flex'}}>
                      {(Array.isArray(project.tech) ? project.tech : String(project.tech).split(',')).map((t: string) => (
                        <span key={t.trim()} className="tech-badge">{t.trim()}</span>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  <p style={{fontSize:13,lineHeight:1.8,color:'rgba(200,168,112,0.7)',margin:'0 0 18px'}}>
                    {project.description}
                  </p>

                  {/* Link */}
                  {project.imageLink && (
                    <a href={project.imageLink} target="_blank" rel="noreferrer" className="proj-link">
                      View Project →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer nav */}
        <div style={{textAlign:'center',marginTop:56,paddingTop:32,borderTop:'1px solid rgba(200,160,70,.1)'}}>
          <Link href="/?go=game" className="back-link">← Back to the Sea</Link>
        </div>
      </div>
    </div>
  );
}
// SplashScreen.tsx
"use client";
import type { CSSProperties } from "react";

export const SUBTITLES = [
  "Sail the seas to learn more about me",
  "Built with React and MongoDB",
  "Computer Science Major at Cal Poly SLO",
];

interface SplashScreenProps {
  entering: boolean;
  transitioning: boolean;
  subtitleIndex: number;
  onExplore: () => void;
}

export default function SplashScreen({ entering, transitioning, subtitleIndex, onExplore }: SplashScreenProps) {
  return (
  <div style={{position:'relative',width:'100%',height:'100vh',background:'#120d09',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Georgia,serif',overflow:'hidden',perspective:1200}}>
    <style>{`
      @keyframes glow{0%,100%{text-shadow:0 0 18px rgba(60,35,10,.25)}50%{text-shadow:0 0 36px rgba(80,45,15,.55)}}
      @keyframes btnGlow{0%,100%{box-shadow:0 0 10px rgba(60,35,10,.15)}50%{box-shadow:0 0 24px rgba(60,35,10,.35)}}
      @keyframes staggerIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      @keyframes anchorBob{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-10px) scale(1.04)}}
      @keyframes subtitleFade{0%{opacity:0;transform:translateY(4px)}15%{opacity:1;transform:translateY(0)}85%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-4px)}}
      @keyframes sparkleDrift{0%{opacity:0;transform:translate(0,0) scale(0.4)}15%{opacity:1}70%{opacity:0.8}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1)}}
      @keyframes shipDrift{0%{transform:translateX(-15vw)}100%{transform:translateX(115vw)}}
      @keyframes shipDriftRev{0%{transform:translateX(115vw) scaleX(-1)}100%{transform:translateX(-15vw) scaleX(-1)}}
      @keyframes posterEnter{
        0%{transform:translate3d(0,0,-2600px) scale(.55);filter:blur(2.5px) brightness(.65)}
        100%{transform:translate3d(0,0,0) scale(1);filter:blur(0) brightness(1)}
      }
      @keyframes posterZoom {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes vignetteFlash{0%{opacity:0}55%{opacity:.28}100%{opacity:1}}
    `}</style>

    <div style={{
      position:'absolute',
      inset:0,
      background:'radial-gradient(circle at 50% 38%, #4b3522 0%, #2b1d12 48%, #100b07 100%)',
    }}/>

    <div style={{
      position:'absolute',
      inset:0,
      opacity:.16,
      backgroundImage:'repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,.04) 1px, transparent 3px), repeating-linear-gradient(90deg, transparent 0px, rgba(0,0,0,.05) 1px, transparent 4px)',
      pointerEvents:'none',
    }}/>

    <div style={{
      position:'absolute',
      left:'6%',
      top:'12%',
      width:180,
      height:260,
      border:'10px solid #24160c',
      background:'linear-gradient(135deg, rgba(70,150,220,.45), rgba(255,190,90,.25))',
      boxShadow:'0 0 80px rgba(255,180,80,.18)',
      opacity:.45,
    }}/>

    <div style={{
      position:'absolute',
      bottom:'16%',
      left:'12%',
      right:'12%',
      height:18,
      background:'#2a180d',
      boxShadow:'0 20px 50px rgba(0,0,0,.55)',
      opacity:.75,
    }}/>

    <div style={{
      position:'relative',
      width:'100%',
      height:'100%',
      transformStyle:'preserve-3d',
      willChange:'transform,filter',
      animation:entering
        ? 'posterEnter .75s cubic-bezier(0.6,0.04,0.98,0.335) both'
        : 'none',
    }}>

      {/* Full wall of background posters */}
      {[
        {x:-120,y:-105,r:-23,title:'CAL POLY SLO',sub:'Mustangs by the sea',desc:'Computer Science, campus life, projects, and building things in San Luis Obispo.'},
        {x:-35,y:-135,r:17,title:'CATS',sub:'Tiny chaos engineers',desc:'Curious cats, cozy naps, island mascots, and mysterious keyboard walking.'},
        {x:58,y:-118,r:-14,title:'REACT.JS',sub:'Interactive UI craft',desc:'Components, hooks, canvas animations, state, routing, and polished web experiences.'},
        {x:145,y:-92,r:24,title:'AI',sub:'Future builder tools',desc:'Exploring intelligent systems, automation, creative workflows, and human-centered software.'},
        {x:-170,y:-8,r:12,title:'WEB DEV',sub:'Browser worlds',desc:'Building interactive web experiences with modern technologies and playful design.'},
        {x:-82,y:-42,r:-20,title:'PROJECTS',sub:'Ideas in motion',desc:'A collection of experiments, apps, classwork, and late-night ideas.'},
        {x:92,y:-28,r:21,title:'CODE',sub:'Write · Debug · Ship',desc:'Turning ideas into clean, efficient, maintainable code.'},
        {x:182,y:-2,r:-24,title:'TOOLS',sub:'Builder mindset',desc:'Debugging, experimenting, and building tools to solve real problems.'},
        {x:-145,y:82,r:-15,title:'OCEAN MAPS',sub:'Portfolio voyage',desc:'A nautical world of islands, routes, secrets, and stories waiting to be explored.'},
        {x:-48,y:128,r:26,title:'DESIGN',sub:'Details matter',desc:'Motion, atmosphere, visual polish, and playful interfaces that feel alive.'},
        {x:72,y:95,r:-22,title:'MUSTANGS',sub:'Cal Poly pride',desc:'Learn by doing, build by trying, improve by shipping.'},
        {x:162,y:142,r:18,title:'FUTURE',sub:'What comes next',desc:'More projects, more ideas, better design, and smarter tools.'},
        {x:-108,y:205,r:22,title:'SYSTEMS',sub:'Software thinking',desc:'Designing logic, structure, and interactions that work together.'},
        {x:18,y:232,r:-19,title:'MONGO DB',sub:'Data layer',desc:'Storing, organizing, and serving data for full-stack ideas.'},
        {x:148,y:198,r:14,title:'UX',sub:'Guide the user',desc:'Clear controls, readable states, and interactions that make sense.'},
      ].map((p,i)=>(
        <div key={i} style={{
          position:'absolute',
          left:`calc(50% + ${p.x}vw)`,
          top:`calc(50% + ${p.y}vh)`,
          transform:`translate(-50%,-50%) rotate(${p.r}deg)`,
          width:'min(520px,64vw)',
          minHeight:'min(610px,68vh)',
          padding:'72px 40px 46px',
          background:'linear-gradient(135deg,#ead7ad,#c6a06a)',
          border:'9px solid #3a2414',
          boxShadow:'0 38px 85px rgba(0,0,0,.65), inset 0 0 52px rgba(80,40,10,.22)',
          color:'#1d160f',
          textAlign:'center',
          zIndex:3,
          opacity:.74,
          pointerEvents:'none',
          overflow:'hidden',
        }}>
          <div style={{
            position:'absolute',
            inset:0,
            opacity:.1,
            backgroundImage:'repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,.12) 1px, transparent 3px)',
          }}/>
          <div style={{position:'absolute',top:14,left:14,width:14,height:14,borderRadius:'50%',background:'#171717'}}/>
          <div style={{position:'absolute',top:14,right:14,width:14,height:14,borderRadius:'50%',background:'#171717'}}/>
          <div style={{position:'absolute',bottom:14,left:14,width:14,height:14,borderRadius:'50%',background:'#171717'}}/>
          <div style={{position:'absolute',bottom:14,right:14,width:14,height:14,borderRadius:'50%',background:'#171717'}}/>
          <h2 style={{position:'relative',zIndex:2,fontSize:'2rem',margin:'0 0 12px',letterSpacing:4,color:'#1d160f'}}>{p.title}</h2>
          <div style={{position:'relative',zIndex:2,fontSize:12,letterSpacing:3,textTransform:'uppercase',opacity:.68,marginBottom:28}}>{p.sub}</div>
          <p style={{position:'relative',zIndex:2,fontSize:16,lineHeight:1.6,maxWidth:380,margin:'0 auto',color:'rgba(29,22,15,.78)'}}>{p.desc}</p>
        </div>
      ))}

      {/* Main Poster card */}
      <div style={{
        position:'absolute',
        left:'50%',
        top:'50%',
        transform:'translate(-50%,-50%) rotate(-1deg)',
        width:'min(620px,82vw)',
        minHeight:'min(720px,78vh)',
        padding:'56px 48px',
        zIndex:5,
        textAlign:'center',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        background:'linear-gradient(135deg,#ead7ad,#c6a06a)',
        border:'10px solid #3a2414',
        boxShadow:'0 40px 90px rgba(0,0,0,.75), 0 10px 22px rgba(0,0,0,.55), inset 0 0 55px rgba(80,40,10,.22)',
        color:'#1d160f',
        overflow:'hidden',
        animation:transitioning
          ? 'posterZoom 0.3s linear forwards'
          : 'none',
      }}>

        <div style={{
          position:'absolute',
          inset:0,
          opacity:.12,
          backgroundImage:'repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,.12) 1px, transparent 3px)',
          pointerEvents:'none',
        }}/>

        {[
          {top:14,left:14},
          {top:14,right:14},
          {bottom:14,left:14},
          {bottom:14,right:14},
        ].map((p,i)=>(
          <div key={i} style={{
            position:'absolute',
            ...p,
            width:14,
            height:14,
            borderRadius:'50%',
            background:'radial-gradient(circle at 35% 30%, #777, #171717)',
            boxShadow:'0 2px 6px rgba(0,0,0,.55)',
            zIndex:8,
          }}/>
        ))}

        <div style={{position:'relative',display:'inline-block',marginBottom:20,zIndex:2}}>
          <div style={{fontSize:64,animation:'anchorBob 3.5s ease-in-out infinite',display:'inline-block',filter:'drop-shadow(0 0 12px rgba(60,35,10,.35))'}}>⚓</div>
          {Array.from({length:8}).map((_,i)=>{
            const angle=(i/8)*Math.PI*2;
            const dx=Math.cos(angle)*40+(i%2===0?10:-10);
            const dy=Math.sin(angle)*40-20-i*4;
            return (
              <div key={i} style={{
                position:'absolute',
                top:'50%',
                left:'50%',
                width:i%3===0?4:2.5,
                height:i%3===0?4:2.5,
                borderRadius:'50%',
                background:i%2===0?'#5a3514':'#2a180d',
                boxShadow:'0 0 6px rgba(60,35,10,0.45)',
                pointerEvents:'none',
                '--dx':`${dx}px`,
                '--dy':`${dy}px`,
                animation:`sparkleDrift ${2.5+(i%3)*0.6}s ease-out ${i*0.35}s infinite`,
              } as CSSProperties}/>
            );
          })}
        </div>

        <h1 style={{
          position:'relative',
          zIndex:2,
          fontSize:'3.2rem',
          fontWeight:'bold',
          margin:'0 0 4px',
          letterSpacing:4,
          animation:'glow 3s ease-in-out infinite',
          color:'#1d160f',
          minHeight:'1.2em',
        }}>
          Hey, I'm Kyle Lin
        </h1>

        <div style={{position:'relative',zIndex:2,animation:'staggerIn 0.7s 1.3s ease forwards',opacity:0,marginBottom:36,marginTop:12}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12}}>
            <div style={{width:60,height:1,background:'linear-gradient(to right,transparent,rgba(40,24,12,0.55))'}}/>
            <div style={{fontSize:14,color:'rgba(40,24,12,0.65)'}}>✦</div>
            <div style={{width:60,height:1,background:'linear-gradient(to left,transparent,rgba(40,24,12,0.55))'}}/>
          </div>
        </div>

        <div style={{position:'relative',zIndex:2,animation:'staggerIn 0.7s 1.45s ease forwards',opacity:0,marginBottom:44,height:20}}>
          <p key={subtitleIndex} style={{
            fontSize:13,
            color:'rgba(35,20,10,0.82)',
            letterSpacing:2,
            margin:0,
            animation:'subtitleFade 3.2s ease forwards',
          }}>
            {SUBTITLES[subtitleIndex]}
          </p>
        </div>

        <div style={{position:'relative',zIndex:2,animation:'staggerIn 0.7s 1.6s ease forwards',opacity:0,pointerEvents:entering?'none':'auto'}}>
          <button
            onClick={onExplore}
            disabled={transitioning}
            style={{
              background:'transparent',
              border:'2px solid #3a2414',
              borderRadius:2,
              color:'#1d160f',
              fontFamily:'Georgia,serif',
              fontSize:'1rem',
              letterSpacing:6,
              padding:'16px 60px',
              cursor:'pointer',
              textTransform:'uppercase',
              transition:'all 0.25s ease',
              animation:'btnGlow 3s ease-in-out infinite',
            }}
            onMouseEnter={e=>{
              const b=e.currentTarget;
              b.style.background='rgba(60,35,10,.12)';
              b.style.boxShadow='0 0 30px rgba(60,35,10,.35)';
              b.style.letterSpacing='8px';
            }}
            onMouseLeave={e=>{
              const b=e.currentTarget;
              b.style.background='transparent';
              b.style.boxShadow='';
              b.style.letterSpacing='6px';
            }}
          >
            Explore
          </button>
        </div>

        <div style={{position:'relative',zIndex:2,animation:'staggerIn 0.7s 1.75s ease forwards',opacity:0,marginTop:22}}>
          <p style={{
            fontSize:10,
            color:'rgba(35,20,10,0.6)',
            letterSpacing:3,
            textTransform:'uppercase',
            margin:0,
          }}>
            WASD or arrow keys to sail · Click islands to visit
          </p>
        </div>
      </div>
    </div>

    {transitioning&&(
      <div style={{
        position:'absolute',
        inset:0,
        background:'#0b1d35',
        zIndex:10,
        animation:'vignetteFlash 0.3s linear forwards',
        pointerEvents:'none',
      }}/>
    )}
  </div>
  );
}
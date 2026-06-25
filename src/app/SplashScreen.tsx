// SplashScreen.tsx
"use client";
import type { CSSProperties, ReactNode } from "react";
import { useEffect } from "react";

export const SUBTITLES = [
  "Sail the seas to learn more about me",
  "Built with React and MongoDB",
  "Computer Science Major at Cal Poly SLO",
];

// A regular grid (90 units apart, both axes) covering the entire
// canvas the background poster wall occupies — not just two rings —
// so density is uniform everywhere, including the parts that sit
// outside the final viewport and only show briefly during the camera
// dive-in. Only the dead-center point is skipped (that's where the
// poster itself sits).
const GRID_TYPES = ['flag','star','compass','rope','cutlasses','anchor','chest','wave','spyglass'];
const GRID_COORDS: [number, number][] = [
  [-180,-180],[-180,-90],[-180,0],[-180,90],[-180,180],
  [-90,-180], [-90,-90], [-90,0], [-90,90], [-90,180],
  [0,-180],   [0,-90],            [0,90],   [0,180],
  [90,-180],  [90,-90],  [90,0],  [90,90],  [90,180],
  [180,-180], [180,-90], [180,0], [180,90], [180,180],
];
const WIDE_DECOS = GRID_COORDS.map(([x,y], i) => ({
  x, y,
  type: GRID_TYPES[i % GRID_TYPES.length],
  r: (i % 2 === 0 ? 1 : -1) * (8 + (i % 5) * 2),
  scale: 0.66 + (i % 4) * 0.045,
  o: 0.5 + (i % 3) * 0.07,
}));

const SHAPE_CLIP: Record<string,string> = {
  circle:    'circle(50% at 50% 50%)',
  square:    'inset(8% round 18%)',
  rectangle: 'inset(10% 24% round 14%)',
  octagon:   'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
};

function ShapeFrame({ children, border, shape = 'circle', size = 60 }: { children: ReactNode; border: string; shape?: string; size?: number }) {
  const clip = SHAPE_CLIP[shape] || SHAPE_CLIP.circle;
  return (
    <div style={{position:'relative',width:size,height:size}}>
      <div style={{position:'absolute',inset:0,background:border,clipPath:clip}}/>
      <div style={{position:'absolute',inset:3,clipPath:clip,background:'radial-gradient(circle at 35% 30%,#ead7ad,#c6a06a)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
        {children}
      </div>
    </div>
  );
}

function ImagePatch({ src, border, shape = 'circle', size = 60, imgSize = 34, filter }: { src:string; border:string; shape?:string; size?:number; imgSize?:number; filter?:string }) {
  return (
    <ShapeFrame border={border} shape={shape} size={size}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        style={{width:imgSize,height:imgSize,objectFit:'contain',filter:filter||'sepia(0.35) saturate(0.75) contrast(0.95)'}}
      />
    </ShapeFrame>
  );
}

function DecoIcon({ type, spin }: { type: string; spin?: boolean }) {
  switch (type) {
    case 'flag':
      return (
        <svg width="70" height="92" viewBox="0 0 70 92">
          <line x1="8" y1="90" x2="8" y2="6" stroke="#3a2414" strokeWidth="4" strokeLinecap="round"/>
          <path d="M8 8 L62 22 L8 38 Z" fill="#1d160f" stroke="#3a2414" strokeWidth="2"/>
          <circle cx="27" cy="21" r="6.5" fill="#ead7ad"/>
          <path d="M22 26 L19 31 M32 26 L35 31" stroke="#ead7ad" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M20 18 L24.5 22.5 M24.5 18 L20 22.5" stroke="#1d160f" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M30 18 L34.5 22.5 M34.5 18 L30 22.5" stroke="#1d160f" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      );
    case 'compass':
      return (
        <div style={{position:'relative',width:56,height:56,borderRadius:'50%',background:'radial-gradient(circle at 35% 30%,#ead7ad,#c6a06a)',border:'3px solid #3a2414',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{position:'absolute',width:2,height:20,top:6,left:'calc(50% - 1px)',transformOrigin:'50% 75%',animation:spin?'compassDecoSpin 9s linear infinite':'none',borderRadius:1,background:'linear-gradient(to bottom,#a01818 50%,#3a2414 50%)'}}/>
          <div style={{position:'absolute',top:3,fontSize:7,fontWeight:'bold',color:'#a01818',letterSpacing:1}}>N</div>
        </div>
      );
    case 'rope':
      return (
        <svg width="58" height="58" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="26" fill="none" stroke="#8a5a2a" strokeWidth="5"/>
          <circle cx="32" cy="32" r="18" fill="none" stroke="#a06a32" strokeWidth="5"/>
          <circle cx="32" cy="32" r="10" fill="none" stroke="#8a5a2a" strokeWidth="5"/>
          <path d="M32 6 L32 1" stroke="#5a3514" strokeWidth="4" strokeLinecap="round"/>
        </svg>
      );
    case 'cutlasses':
      return (
        <svg width="68" height="68" viewBox="0 0 74 74">
          <g transform="rotate(45 37 37)">
            <rect x="34" y="6" width="6" height="40" rx="2" fill="#c8c8c8" stroke="#3a2414" strokeWidth="1.5"/>
            <rect x="30" y="44" width="14" height="8" rx="2" fill="#3a2414"/>
            <rect x="34" y="50" width="6" height="14" rx="2" fill="#5a3514"/>
          </g>
          <g transform="rotate(-45 37 37)">
            <rect x="34" y="6" width="6" height="40" rx="2" fill="#c8c8c8" stroke="#3a2414" strokeWidth="1.5"/>
            <rect x="30" y="44" width="14" height="8" rx="2" fill="#3a2414"/>
            <rect x="34" y="50" width="6" height="14" rx="2" fill="#5a3514"/>
          </g>
        </svg>
      );
    case 'anchor':
      return (
        <svg width="50" height="56" viewBox="0 0 50 56">
          <circle cx="25" cy="10" r="6" fill="none" stroke="#3a2414" strokeWidth="3"/>
          <line x1="25" y1="16" x2="25" y2="44" stroke="#3a2414" strokeWidth="3"/>
          <line x1="13" y1="24" x2="37" y2="24" stroke="#3a2414" strokeWidth="3"/>
          <path d="M7 34 Q25 54 43 34" fill="none" stroke="#3a2414" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      );
    case 'star':
      return (
        <svg width="40" height="40" viewBox="0 0 64 64">
          <path d="M32 6 L39 27 L60 32 L39 37 L32 58 L25 37 L4 32 L25 27 Z" fill="#ead7ad" stroke="#3a2414" strokeWidth="1.5"/>
        </svg>
      );
    case 'chest':
      return (
        <svg width="54" height="46" viewBox="0 0 64 56">
          <rect x="6" y="26" width="52" height="26" rx="4" fill="#5a3514" stroke="#2a1608" strokeWidth="2.5"/>
          <path d="M6 26 Q32 6 58 26" fill="#6a4018" stroke="#2a1608" strokeWidth="2.5"/>
          <rect x="26" y="30" width="12" height="14" rx="2" fill="#c8a020" stroke="#2a1608" strokeWidth="1.5"/>
        </svg>
      );
    case 'spyglass':
      return (
        <svg width="62" height="46" viewBox="0 0 64 48">
          <path d="M6 38 L48 12 L56 24 L14 50 Z" fill="#6a4018" stroke="#2a1608" strokeWidth="2"/>
          <circle cx="9" cy="40" r="6" fill="#2a1608"/>
          <circle cx="9" cy="40" r="3" fill="#1d160f"/>
        </svg>
      );
    case 'wave':
      return (
        <svg width="70" height="26" viewBox="0 0 70 26">
          <path d="M2 16 Q12 4 22 16 T42 16 T62 16" stroke="#5a7a92" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        </svg>
      );
    case 'react':
      return (
        <ShapeFrame border="#2a5a5e" shape="octagon" size={62}>
          <svg width="32" height="32" viewBox="-11.5 -11.5 23 23">
            <circle r="2.2" fill="#3a6a6e"/>
            <g stroke="#3a6a6e" strokeWidth="1" fill="none" opacity="0.85">
              <ellipse rx="11" ry="4.2"/>
              <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
              <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
            </g>
          </svg>
        </ShapeFrame>
      );
    case 'calpoly':
      return <ImagePatch src="/assets/logos/calPolyLogo2.svg.png" border="#1e4d2b" shape="circle" imgSize={38}/>;
    case 'aws':
      return <ImagePatch src="/assets/logos/awsIcon2.png" border="#3a2414" shape="square" size={78} imgSize={46}/>;
    case 'python':
      return (
        <ImagePatch
          src="/assets/logos/python-logo-only.png"
          border="#2b5b84"
          shape="rectangle"
          size={100}
          imgSize={36}
        />
  );
    case 'github':
      return <ImagePatch src="/assets/logos/githubLogo.png" border="#24292e" shape="circle" size={78} imgSize={52}/>;
    default:
      return null;
  }
}

interface SplashScreenProps {
  entering: boolean;
  transitioning: boolean;
  subtitleIndex: number;
  onExplore: () => void;
}

export default function SplashScreen({ entering, transitioning, subtitleIndex, onExplore }: SplashScreenProps) {
  useEffect(() => {
  const checkBottom = () => {
    const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight - 5);
    console.log("bottom element:", el);
    console.log("bottom bg:", el ? getComputedStyle(el).backgroundColor : "none");
    console.log({
      innerHeight: window.innerHeight,
      htmlHeight: document.documentElement.clientHeight,
      bodyHeight: document.body.clientHeight,
    });
  };

  setTimeout(checkBottom, 500);
  setTimeout(checkBottom, 1500);
  setTimeout(checkBottom, 3000);
}, []);
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
      @keyframes compassDecoSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @media (max-width: 760px){
        .splash-deco{display:none}
      }
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

      {/* Extra decorations live far out, never crowding the poster */}
      {WIDE_DECOS.map((d,i)=>(
        <div key={i} className="splash-deco" style={{
          position:'absolute',
          left:`calc(50% + ${d.x}vw)`,
          top:`calc(50% + ${d.y}vh)`,
          transform:`translate(-50%,-50%) rotate(${d.r}deg) scale(${d.scale})`,
          zIndex:4,
          opacity:d.o,
          filter:'drop-shadow(0 6px 10px rgba(0,0,0,.5))',
          pointerEvents:'none',
        }}>
          <DecoIcon type={d.type}/>
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

       
      </div>

      {/* The 5 named logos sit close to the poster — nothing else does */}

      <div className="splash-deco" style={{
        position:'absolute',
        left:'calc(50% - 34vw)',
        top:'calc(50% - 26vh)',
        transform:'translate(-50%,-50%) rotate(-8deg) scale(1.05)',
        zIndex:6,
        opacity:.85,
        filter:'drop-shadow(0 6px 10px rgba(0,0,0,.5))',
        pointerEvents:'none',
      }}>
        <DecoIcon type="calpoly"/>
      </div>

      <div className="splash-deco" style={{
        position:'absolute',
        left:'calc(50% + 29vw)',
        top:'calc(50% - 34vh)',
        transform:'translate(-50%,-50%) rotate(10deg) scale(0.9)',
        zIndex:6,
        opacity:.85,
        filter:'drop-shadow(0 6px 10px rgba(0,0,0,.5))',
        pointerEvents:'none',
      }}>
        <DecoIcon type="react"/>
      </div>

      <div className="splash-deco" style={{
        position:'absolute',
        left:'calc(50% + 38vw)',
        top:'calc(50% - 6vh)',
        transform:'translate(-50%,-50%) rotate(-12deg) scale(1)',
        zIndex:6,
        opacity:.85,
        filter:'drop-shadow(0 6px 10px rgba(0,0,0,.5))',
        pointerEvents:'none',
      }}>
        <DecoIcon type="aws"/>
      </div>

      <div className="splash-deco" style={{
        position:'absolute',
        left:'calc(50% + 36vw)',
        top:'calc(50% + 35vh)',
        transform:'translate(-50%,-50%) rotate(16deg) scale(0.95)',
        zIndex:6,
        opacity:.85,
        filter:'drop-shadow(0 6px 10px rgba(0,0,0,.5))',
        pointerEvents:'none',
      }}>
        <DecoIcon type="python"/>
      </div>

      <div className="splash-deco" style={{
        position:'absolute',
        left:'calc(50% - 35vw)',
        top:'calc(50% + 20vh)',
        transform:'translate(-50%,-50%) rotate(-8deg) scale(1)',
        zIndex:6,
        opacity:.85,
        filter:'drop-shadow(0 6px 10px rgba(0,0,0,.5))',
        pointerEvents:'none',
      }}>
        <DecoIcon type="github"/>
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
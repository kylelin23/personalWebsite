"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// ── Island positions as % of canvas (all visible from start) ──
const ISLE_DATA = [
  { id:'contact',   name:'Contact Harbor', lbl:'Contact',   pX:.50, pY:.13, r:82, snd:'#d8a830', grs:'#182848' },
  { id:'home',      name:'Home Island',    lbl:'Home',      pX:.14, pY:.25, r:88, snd:'#ddb84a', grs:'#2a7a15' },
  { id:'blog',      name:'Blog Cove',      lbl:'Blog',      pX:.86, pY:.25, r:78, snd:'#c89030', grs:'#4a5a10' },
  { id:'portfolio', name:'Portfolio Bay',  lbl:'Portfolio', pX:.86, pY:.80, r:92, snd:'#e8b840', grs:'#186838' },
  { id:'resume',    name:'Resume Rock',    lbl:'Resume',    pX:.14, pY:.80, r:72, snd:'#b08020', grs:'#382808' },
];

const INFO: Record<string, { icon:string; title:string; sub:string; url:string; page:string; items:{t:string;ind:boolean}[] }> = {
  home: { icon:'🏠', title:'Home Island', sub:'About Me', url:'/', page:'Home', items:[
    {t:'B.S. Computer Science @ Cal Poly SLO',ind:false},
    {t:'Expected Graduation: June 2027',ind:false},
    {t:'GPA: 3.6  ·  Honors Student',ind:false},
    {t:'Full-Stack & Mobile Developer',ind:false},
    {t:'San Luis Obispo, CA  ·  U.S. Citizen',ind:false},
  ]},
  blog: { icon:'📜', title:'Blog Cove', sub:'Blog', url:'/blog/', page:'Blog', items:[
    {t:'Personal thoughts, stories & updates',ind:false},
    {t:'Mid Autumn Festival — Oct 2025',ind:true},
    {t:'First Week of School — Sep 2025',ind:true},
    {t:'Life at Cal Poly SLO',ind:false},
    {t:'More posts coming soon...',ind:false},
  ]},
  portfolio: { icon:'🗺️', title:'Portfolio Bay', sub:'Projects', url:'/portfolio/', page:'Portfolio', items:[
    {t:'Cat Adoption App — iOS Mobile App',ind:false},
    {t:'Built with React Native',ind:true},
    {t:'Personalized content & recommendation flows',ind:true},
    {t:'Personal Website (this one!)',ind:false},
    {t:'Next.js · MongoDB · Full-Stack',ind:true},
  ]},
  resume: { icon:'📄', title:'Resume Rock', sub:'Skills & Experience', url:'/resume/', page:'Resume', items:[
    {t:'Languages: Java · Python · C · SQL · JS · TypeScript',ind:false},
    {t:'Frameworks: React · React Native · Node.js',ind:false},
    {t:'Hack4Impact Developer — Sep 2025–Present',ind:false},
    {t:'CS Tutor (Part-Time) — Sep 2025–Present',ind:false},
    {t:'Frontend Dev Intern — Jul–Sep 2025',ind:false},
  ]},
  contact: { icon:'⚓', title:'Contact Harbor', sub:'Get in Touch', url:'/contact/', page:'Contact', items:[
    {t:'linkyle0924@gmail.com',ind:false},
    {t:'408-724-0431',ind:false},
    {t:'linkedin.com/in/kyle-lin-584235295',ind:false},
    {t:'github.com/kylelin23',ind:false},
    {t:'Open to work & collaboration!',ind:false},
  ]},
};

// Pre-computed foam positions (% of canvas)
const FOAM = Array.from({length:60},(_,i)=>({pX:((i*37*127+113)%9973)/9973, pY:((i*53*89+227)%9871)/9871, ph:i*2.17, sz:1.5+(i%3)*0.7}));

const ACCEL=0.2, FRIC=0.87, MSPD=4.0, IDIST=165;

type Isle = typeof ISLE_DATA[0] & { x:number; y:number };

export default function Home() {
  const router = useRouter();
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const shipRef = useRef({ x:0, y:0, vx:0, vy:0, ang:0, spd:0, ready:false });
  const keysRef = useRef<Record<string,boolean>>({});
  const wakeRef = useRef<{wx:number;wy:number;age:number;ma:number}[]>([]);
  const tickRef = useRef(0);
  const animRef = useRef(0);
  const islesRef = useRef<Isle[]>([]);
  const nearRef = useRef<Isle|null>(null);
  const exploringRef = useRef<string|null>(null);

  const [near, setNear] = useState<string|null>(null);
  const [exploring, setExploring] = useState<string|null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [introFade, setIntroFade] = useState(false);

  const openIsland = (id: string) => { exploringRef.current = id; setExploring(id); };
  const closeModal  = () => { exploringRef.current = null; setExploring(null); };

  useEffect(() => {
    setTimeout(() => setIntroFade(true), 2000);
    setTimeout(() => setShowIntro(false), 3300);

    const canvas = cvsRef.current!;
    const ctx = canvas.getContext('2d')!;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight - 80; // below navbar
      if (!shipRef.current.ready) {
        shipRef.current.x = canvas.width / 2;
        shipRef.current.y = canvas.height / 2;
        shipRef.current.ready = true;
      }
    }
    resize();
    window.addEventListener('resize', resize);

    const kd = (e: KeyboardEvent) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
      keysRef.current[e.key] = true;
      if ((e.key==='e'||e.key==='E') && nearRef.current && !exploringRef.current) openIsland(nearRef.current.id);
      if (e.key==='Escape') closeModal();
    };
    const ku = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);

    // Click on island to open
    function onCanvasClick(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      for (const isle of islesRef.current) {
        if (Math.hypot(cx - isle.x, cy - isle.y) < isle.r * 0.78) { openIsland(isle.id); return; }
      }
    }
    // Cursor changes over island
    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      canvas.style.cursor = islesRef.current.some(i => Math.hypot(mx-i.x, my-i.y) < i.r*0.78) ? 'pointer' : 'default';
    }
    canvas.addEventListener('click', onCanvasClick);
    canvas.addEventListener('mousemove', onMouseMove);

    // ── DRAW OCEAN ──
    function drawOcean(W: number, H: number) {
      ctx.fillStyle = '#0b1d35'; ctx.fillRect(0,0,W,H);
      const rh=52, nr=Math.ceil(H/rh)+2;
      for (let r=-1; r<nr; r++) {
        const sy=r*rh, ph=tickRef.current*0.008+r*0.9;
        ctx.beginPath();
        for (let x=-20; x<W+20; x+=5) {
          const y=sy+9*Math.sin(x*0.014+ph)+4*Math.sin(x*0.023-ph*1.2);
          x===-20?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        ctx.strokeStyle=`rgba(90,170,240,${Math.max(0,0.038+0.025*Math.sin(r*2.3+tickRef.current*0.009))})`;
        ctx.lineWidth=1.5; ctx.stroke();
      }
      FOAM.forEach(f => {
        const sx=f.pX*W, sy=f.pY*H, a=Math.max(0,Math.sin(tickRef.current*0.04+f.ph))*0.28;
        if (a<0.03) return;
        ctx.beginPath(); ctx.arc(sx,sy,f.sz,0,Math.PI*2); ctx.fillStyle=`rgba(190,225,255,${a})`; ctx.fill();
      });
    }

    // ── DRAW ISLAND ──
    function drawIsle(isle: Isle) {
      const {x,y,r,snd,grs,name,lbl} = isle;
      // Ripple
      ctx.beginPath(); ctx.ellipse(x,y,r+22,r*0.65+15,0,0,Math.PI*2); ctx.fillStyle='rgba(80,150,200,0.1)'; ctx.fill();
      // Sand
      ctx.save(); ctx.shadowColor='rgba(0,0,0,0.45)'; ctx.shadowBlur=22; ctx.shadowOffsetX=5; ctx.shadowOffsetY=8;
      ctx.beginPath(); ctx.ellipse(x,y,r,r*0.62,0,0,Math.PI*2); ctx.fillStyle=snd; ctx.fill(); ctx.restore();
      // Grass
      ctx.beginPath(); ctx.ellipse(x,y-r*0.05,r*0.68,r*0.43,0,0,Math.PI*2); ctx.fillStyle=grs; ctx.fill();
      // Trees
      [{ox:-r*.22,oy:-r*.2},{ox:r*.22,oy:-r*.16},{ox:0,oy:r*.12}].forEach(({ox,oy}) => {
        const tx=x+ox, ty=y+oy;
        ctx.beginPath(); ctx.ellipse(tx+4,ty+5,9,7,0,0,Math.PI*2); ctx.fillStyle='rgba(0,0,0,0.18)'; ctx.fill();
        for (let a=0;a<7;a++) {
          const ang=(a/7)*Math.PI*2+tickRef.current*0.012+ox*0.05;
          ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(tx+Math.cos(ang)*14,ty+Math.sin(ang)*9);
          ctx.strokeStyle='#3a9a20'; ctx.lineWidth=3.5; ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(tx,ty,3.5,0,Math.PI*2); ctx.fillStyle='#7a5010'; ctx.fill();
      });
      // Labels
      ctx.save(); ctx.shadowColor='rgba(0,0,0,0.9)'; ctx.shadowBlur=6;
      ctx.fillStyle='#ffe07a'; ctx.font='bold 13px Georgia,serif'; ctx.textAlign='center';
      ctx.fillText(name,x,y+r*.62+18);
      ctx.fillStyle='rgba(255,240,180,0.6)'; ctx.font='11px Georgia,serif'; ctx.fillText(lbl,x,y+r*.62+32);
      ctx.restore();
    }

    // ── DRAW GOING MERRY ──
    function drawShip() {
      const {x,y,ang,spd} = shipRef.current;
      ctx.save(); ctx.translate(x,y); ctx.rotate(ang-Math.PI/2);
      // White hull + navy stripe
      ctx.save();
      ctx.shadowColor='rgba(0,0,0,0.55)'; ctx.shadowBlur=18; ctx.shadowOffsetX=6; ctx.shadowOffsetY=8;
      ctx.beginPath(); ctx.moveTo(0,-38); ctx.bezierCurveTo(22,-24,24,8,17,30); ctx.lineTo(-17,30); ctx.bezierCurveTo(-24,8,-22,-24,0,-38); ctx.closePath();
      ctx.fillStyle='#eeeae0'; ctx.fill(); ctx.restore();
      ctx.beginPath(); ctx.moveTo(0,-38); ctx.bezierCurveTo(22,-24,24,8,17,30); ctx.lineTo(-17,30); ctx.bezierCurveTo(-24,8,-22,-24,0,-38); ctx.closePath();
      ctx.strokeStyle='#1e2d5a'; ctx.lineWidth=5.5; ctx.stroke();
      // Deck + planks
      ctx.beginPath(); ctx.moveTo(0,-29); ctx.bezierCurveTo(15,-18,17,5,13,24); ctx.lineTo(-13,24); ctx.bezierCurveTo(-17,5,-15,-18,0,-29);
      ctx.fillStyle='#c07030'; ctx.fill();
      for (let i=0;i<5;i++) { const p=i/4,py=-24+p*46,w=5+8*Math.sin(p*Math.PI); ctx.beginPath();ctx.moveTo(-w,py);ctx.lineTo(w,py);ctx.strokeStyle='rgba(55,22,4,0.28)';ctx.lineWidth=0.9;ctx.stroke(); }
      // Mast base
      ctx.beginPath(); ctx.arc(0,-5,5,0,Math.PI*2); ctx.fillStyle='#8b6010'; ctx.fill();
      // Square sail
      const bx=Math.min(spd*1.5,5)+Math.sin(tickRef.current*0.03)*2.5;
      ctx.beginPath(); ctx.moveTo(-20,-24); ctx.quadraticCurveTo(-20+bx,-9,-17,9); ctx.lineTo(17,9); ctx.quadraticCurveTo(20+bx,-9,20,-24); ctx.closePath();
      ctx.fillStyle='rgba(242,228,182,0.97)'; ctx.fill(); ctx.strokeStyle='#b89050'; ctx.lineWidth=1.2; ctx.stroke();
      ctx.fillStyle='rgba(80,28,5,0.7)'; ctx.font='bold 9px serif'; ctx.textAlign='center'; ctx.fillText('KL',bx/2,-7);
      // Crossbar + mast pole + rigging
      ctx.beginPath(); ctx.moveTo(-22,-24); ctx.lineTo(22,-24); ctx.strokeStyle='#7a4010'; ctx.lineWidth=2.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,-24); ctx.lineTo(0,-52); ctx.strokeStyle='#7a4010'; ctx.lineWidth=2.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-22,-24); ctx.lineTo(0,-52); ctx.moveTo(22,-24); ctx.lineTo(0,-52); ctx.strokeStyle='rgba(155,110,50,0.35)'; ctx.lineWidth=1; ctx.stroke();
      // Bowsprit + flag
      ctx.beginPath(); ctx.moveTo(0,-38); ctx.lineTo(0,-56); ctx.strokeStyle='#8b6010'; ctx.lineWidth=2; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,-52); ctx.lineTo(13,-45); ctx.lineTo(0,-38); ctx.closePath(); ctx.fillStyle='#111'; ctx.fill();
      // Sheep figurehead (Merry!)
      ctx.save(); ctx.translate(0,-38);
      ctx.beginPath(); ctx.arc(0,0,7.5,0,Math.PI*2); ctx.fillStyle='#f8f8f4'; ctx.fill(); ctx.strokeStyle='#bbb'; ctx.lineWidth=0.8; ctx.stroke();
      for (let a=0;a<6;a++) { const ang=(a/6)*Math.PI*2; ctx.beginPath(); ctx.arc(Math.cos(ang)*5.2,Math.sin(ang)*5.2,2.8,0,Math.PI*2); ctx.fillStyle='#f2f0ea'; ctx.fill(); }
      ctx.beginPath(); ctx.arc(-5,-3.5,3.2,Math.PI*0.75,Math.PI*0.1); ctx.strokeStyle='#c8a060'; ctx.lineWidth=2; ctx.stroke();
      ctx.beginPath(); ctx.arc(5,-3.5,3.2,Math.PI*0.9,Math.PI*0.25,true); ctx.stroke();
      ctx.beginPath(); ctx.arc(-2.8,0.8,1.3,0,Math.PI*2); ctx.fillStyle='#333'; ctx.fill();
      ctx.beginPath(); ctx.arc(2.8,0.8,1.3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(-2.2,0.2,0.5,0,Math.PI*2); ctx.fillStyle='white'; ctx.fill();
      ctx.beginPath(); ctx.arc(3.4,0.2,0.5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(0,3,1.2,0,Math.PI*2); ctx.fillStyle='#ff9999'; ctx.fill();
      ctx.restore();
      // Lantern
      ctx.save(); ctx.shadowColor='rgba(255,140,0,.9)'; ctx.shadowBlur=14; ctx.beginPath(); ctx.arc(0,26,3,0,Math.PI*2); ctx.fillStyle='#ffcc44'; ctx.fill(); ctx.restore();
      ctx.restore();
    }

    // ── DRAW WAKE ──
    function drawWake() {
      wakeRef.current.forEach(p => {
        const life=1-p.age/p.ma;
        ctx.beginPath(); ctx.arc(p.wx,p.wy,3+(1-life)*18,0,Math.PI*2);
        ctx.fillStyle=`rgba(140,200,255,${life*0.2})`; ctx.fill();
      });
    }

    // ── DRAW COMPASS ──
    function drawCompass(W: number, H: number) {
      const cr=34,cx=W-52,cy=H-52;
      ctx.save(); ctx.globalAlpha=0.88;
      ctx.beginPath(); ctx.arc(cx,cy,cr,0,Math.PI*2); ctx.fillStyle='rgba(8,20,40,0.9)'; ctx.fill(); ctx.strokeStyle='#c8a870'; ctx.lineWidth=1.8; ctx.stroke();
      (['N','E','S','W'] as const).forEach((l,i) => {
        const a=i*Math.PI/2;
        ctx.fillStyle=l==='N'?'#ff5555':'#c8a870'; ctx.font='bold 8px Georgia,serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(l,cx+Math.sin(a)*(cr-10),cy-Math.cos(a)*(cr-10));
      });
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(shipRef.current.ang);
      ctx.beginPath(); ctx.moveTo(0,-(cr-6)); ctx.lineTo(3.5,4); ctx.lineTo(-3.5,4); ctx.closePath(); ctx.fillStyle='#ff4444'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(0,cr-6); ctx.lineTo(3.5,-4); ctx.lineTo(-3.5,-4); ctx.closePath(); ctx.fillStyle='#c8a870'; ctx.fill();
      ctx.restore(); ctx.restore();
    }

    // ── GAME LOOP ──
    function loop() {
      tickRef.current++;
      const W=canvas.width, H=canvas.height;

      // Recompute island positions from percentages each frame (handles resize)
      islesRef.current = ISLE_DATA.map(d => ({...d, x:d.pX*W, y:d.pY*H}));

      // Move ship
      if (!exploringRef.current) {
        const k=keysRef.current;
        let ax=0,ay=0;
        if(k['ArrowUp']  ||k['w']||k['W'])ay-=ACCEL;
        if(k['ArrowDown'] ||k['s']||k['S'])ay+=ACCEL;
        if(k['ArrowLeft'] ||k['a']||k['A'])ax-=ACCEL;
        if(k['ArrowRight']||k['d']||k['D'])ax+=ACCEL;
        const s=shipRef.current;
        s.vx=(s.vx+ax)*FRIC; s.vy=(s.vy+ay)*FRIC;
        const spd=Math.hypot(s.vx,s.vy);
        if(spd>MSPD){s.vx=s.vx/spd*MSPD;s.vy=s.vy/spd*MSPD;}
        s.spd=spd;
        if(spd>0.08)s.ang=Math.atan2(s.vy,s.vx);
        s.x=Math.max(40,Math.min(W-40,s.x+s.vx));
        s.y=Math.max(40,Math.min(H-40,s.y+s.vy));
        if(spd>0.25&&tickRef.current%3===0) wakeRef.current.push({wx:s.x-Math.cos(s.ang)*24,wy:s.y-Math.sin(s.ang)*24,age:0,ma:45});
      }
      wakeRef.current=wakeRef.current.map(p=>({...p,age:p.age+1})).filter(p=>p.age<p.ma);

      // Near island
      nearRef.current=null;
      islesRef.current.forEach(i=>{ if(Math.hypot(shipRef.current.x-i.x,shipRef.current.y-i.y)<IDIST)nearRef.current=i; });
      setNear(nearRef.current?.id||null);

      // Draw
      drawOcean(W,H);
      islesRef.current.forEach(drawIsle);
      // Pulse ring
      if(nearRef.current&&!exploringRef.current){
        const{x,y,r}=nearRef.current;
        ctx.save();ctx.globalAlpha=0.7+0.3*Math.sin(tickRef.current*0.12);
        ctx.beginPath();ctx.arc(x,y,r*0.62+26,0,Math.PI*2);ctx.strokeStyle='#ffdd44';ctx.lineWidth=2.5;ctx.setLineDash([8,6]);ctx.stroke();ctx.setLineDash([]);ctx.restore();
      }
      drawWake(); drawShip(); drawCompass(W,H);

      animRef.current = requestAnimationFrame(loop);
    }
    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize',resize);
      window.removeEventListener('keydown',kd);
      window.removeEventListener('keyup',ku);
      canvas.removeEventListener('click',onCanvasClick);
      canvas.removeEventListener('mousemove',onMouseMove);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exp = exploring ? INFO[exploring] : null;

  return (
    <div style={{position:'relative',width:'100%',height:'calc(100vh - 80px)',overflow:'hidden',background:'#0b1d35',fontFamily:'Georgia,serif'}}>
      <canvas ref={cvsRef} style={{display:'block',width:'100%',height:'100%'}} />

      {/* HUD */}
      <div style={{position:'absolute',top:14,left:16,color:'#f5e6c0',pointerEvents:'none',zIndex:5}}>
        <div style={{fontSize:15,fontWeight:'bold',textShadow:'0 0 10px rgba(200,168,80,.5)'}}>⚓ Kyle Lin's World</div>
        <div style={{fontSize:10,color:'rgba(200,168,112,.5)',marginTop:3}}>WASD / ↑↓←→ to sail  ·  E or click an island to visit</div>
      </div>

      {/* Intro fade */}
      {showIntro && (
        <div style={{position:'absolute',inset:0,background:'rgba(4,10,22,0.82)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:15,color:'#f5e6c0',textAlign:'center',opacity:introFade?0:1,transition:'opacity 1.3s ease',pointerEvents:'none'}}>
          <div>
            <div style={{fontSize:52,marginBottom:10}}>⚓</div>
            <h2 style={{fontSize:'2rem',marginBottom:6,letterSpacing:2}}>Kyle Lin's World</h2>
            <p style={{color:'#c8a870',fontSize:11,letterSpacing:3,marginBottom:8}}>SAIL OR CLICK THE ISLANDS TO EXPLORE</p>
          </div>
        </div>
      )}

      {/* Near island prompt */}
      {near && !exploring && (
        <div style={{position:'absolute',bottom:24,left:'50%',transform:'translateX(-50%)',background:'rgba(8,18,35,.93)',border:'1px solid #c8a870',borderRadius:9,padding:'10px 26px',color:'#f5e6c0',fontSize:13,whiteSpace:'nowrap',pointerEvents:'none',zIndex:5}}>
          Press{' '}
          <kbd style={{background:'rgba(200,160,50,.2)',border:'1px solid #c8a870',borderRadius:3,padding:'1px 7px',fontWeight:'bold',fontFamily:'Georgia,serif'}}>E</kbd>
          {' '}or click to visit {ISLE_DATA.find(i=>i.id===near)?.name}
        </div>
      )}

      {/* Mobile D-pad */}
      <div style={{position:'absolute',bottom:18,right:18,display:'grid',gridTemplateColumns:'38px 38px 38px',gridTemplateRows:'38px 38px 38px',gap:4,zIndex:5}}>
        {(['','dU','','dL','dD','dR'] as const).map((id,i) => {
          if (!id) return <div key={i}/>;
          const label = id==='dU'?'↑':id==='dD'?'↓':id==='dL'?'←':'→';
          const key   = id==='dU'?'ArrowUp':id==='dD'?'ArrowDown':id==='dL'?'ArrowLeft':'ArrowRight';
          return (
            <div key={id}
              onPointerDown={e=>{e.preventDefault();keysRef.current[key]=true;}}
              onPointerUp={()=>keysRef.current[key]=false}
              onPointerLeave={()=>keysRef.current[key]=false}
              style={{background:'rgba(200,160,70,.15)',border:'1px solid rgba(200,160,70,.4)',borderRadius:6,color:'#c8a870',fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',userSelect:'none',touchAction:'none'}}
            >{label}</div>
          );
        })}
      </div>

      {/* Island modal */}
      {exploring && exp && (
        <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:20}} onClick={closeModal}>
          <div style={{background:'linear-gradient(145deg,#190d04,#281808)',border:'2px solid #c8a070',borderRadius:14,padding:'32px 40px',maxWidth:460,width:'90%',color:'#f5e6c0',maxHeight:'88vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:40,textAlign:'center',marginBottom:6}}>{exp.icon}</div>
            <h2 style={{textAlign:'center',fontSize:'1.4rem',color:'#ffe088',marginBottom:4}}>{exp.title}</h2>
            <div style={{textAlign:'center',color:'#c8a060',letterSpacing:3,fontSize:10,textTransform:'uppercase',marginBottom:18}}>{exp.sub}</div>
            <div style={{borderTop:'1px solid rgba(200,160,70,.3)',paddingTop:14,marginBottom:18}}>
              {exp.items.map((item,i) => (
                <div key={i} style={{padding:'7px 0',borderBottom:'1px solid rgba(200,160,70,.1)',fontSize:13,color:item.ind?'#c8a878':'#f0dcb0',display:'flex',gap:10,alignItems:'flex-start'}}>
                  <span style={{color:'#c8a050',flexShrink:0,marginTop:1}}>{item.ind?'↳':'▸'}</span>{item.t}
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:10}}>
              <button
                onClick={() => router.push(exp.url)}
                style={{flex:1,background:'linear-gradient(135deg,#1a3a7a,#2a5aaa)',border:'1px solid #5a8ae0',borderRadius:8,color:'#c8d8ff',fontFamily:'Georgia,serif',fontSize:13,padding:'10px 0',cursor:'pointer',letterSpacing:1}}
              >🗺️ Visit {exp.page}</button>
              <button
                onClick={closeModal}
                style={{flex:1,background:'linear-gradient(135deg,#6b2a0a,#9b4a18)',border:'1px solid #c8a060',borderRadius:8,color:'#ffe8a0',fontFamily:'Georgia,serif',fontSize:13,padding:'10px 0',cursor:'pointer',letterSpacing:1}}
              >⚓ Back to Sea</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
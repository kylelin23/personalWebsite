"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ISLE_DATA = [
  { id:'home',      name:'Home Island',      lbl:'Home',      pX:.50, pY:.50, r:145, theme:'emerald' },
  { id:'contact',   name:'Contact Island',   lbl:'Contact',   pX:.50, pY:.16, r:105, theme:'sunset'  },
  { id:'blog',      name:'Blog Island',      lbl:'Blog',      pX:.86, pY:.30, r:118, theme:'storm'   },
  { id:'portfolio', name:'Portfolio Island', lbl:'Portfolio', pX:.86, pY:.76, r:140, theme:'golden'  },
  { id:'resume',    name:'Resume Island',    lbl:'Resume',    pX:.14, pY:.76, r:125, theme:'crystal' },
];
const ROUTES:Record<string,string>={home:'/',blog:'/blog/',portfolio:'/portfolio/',resume:'/resume/',contact:'/contact/'};
const THEMES:Record<string,{sand:string;top:string;accent:string}>={
  emerald:{sand:'#829e7d',top:'#829e7d',accent:'#80ff90'},
  storm:  {sand:'#829e7d',top:'#829e7d',accent:'#ffe080'},
  golden: {sand:'#829e7d',top:'#829e7d',accent:'#ffd060'},
  crystal:{sand:'#829e7d',top:'#829e7d',accent:'#a0e8ff'},
  sunset: {sand:'#829e7d',top:'#829e7d',accent:'#ffaa60'},
};

const WRECKS=Array.from({length:12},(_,i)=>({
  pX:((i*173+89+i*61)%8200+300)/9800,
  pY:((i*251+137+i*97)%7000+500)/9000,
  rot:(i*0.71)%Math.PI,sz:0.5+Math.sin(i*1.3)*0.25,
}));

const BIRD_FLOCKS=Array.from({length:5},(_,fi)=>({
  pX:fi*0.22,pY:0.07+fi*0.19,
  dir:fi%2===0?1:-1,speed:0.00015+fi*0.00003,count:4+fi*2,phase:fi*1.6,
}));

// Walkers per island — angle on island perimeter, speed, color
const ISLAND_WALKERS:Record<string,{angle:number;speed:number;shirt:string;pants:string;side:number}[]>={
  home:   [{angle:0,   speed:0.003, shirt:'#4a7ab5',pants:'#2a2a2a',side:1},{angle:2.1, speed:0.0025,shirt:'#f5f0e0',pants:'#3a2510',side:-1},{angle:4.2, speed:0.0028,shirt:'#3a7a3a',pants:'#1a1a3a',side:1}],
  blog:   [{angle:0.5, speed:0.0028,shirt:'#c8c8b0',pants:'#2a2010',side:1},{angle:2.6, speed:0.0025,shirt:'#2a4a8a',pants:'#1a1a1a',side:-1}],
  portfolio:[{angle:1.0,speed:0.003, shirt:'#1a1a1a',pants:'#3a2510',side:1},{angle:3.1, speed:0.0025,shirt:'#d8c8a0',pants:'#2a2a2a',side:-1},{angle:5.0, speed:0.0028,shirt:'#4a6a3a',pants:'#1a1a3a',side:1}],
  resume: [{angle:0.8, speed:0.0028,shirt:'#2a4a8a',pants:'#1a1a1a',side:1},{angle:2.9, speed:0.003, shirt:'#e8e8e8',pants:'#2a2010',side:-1}],
  contact:[{angle:1.5, speed:0.0025,shirt:'#3a7a3a',pants:'#2a2a2a',side:1},{angle:3.6, speed:0.0028,shirt:'#8a6a40',pants:'#1a1a3a',side:-1}],
};
// Cat on home island — orbit params
const CAT={angle:1.2,speed:0.004};

const FOAM=Array.from({length:60},(_,i)=>({pX:((i*37*127+113)%9973)/9973,pY:((i*53*89+227)%9871)/9871,ph:i*2.17,sz:1.5+(i%3)*0.7}));
const ACCEL=0.2,FRIC=0.87,MSPD=4.0,IDIST=185,TRAIL_LEN=80;
type Isle=typeof ISLE_DATA[0]&{x:number;y:number};
type Pt={x:number;y:number};
type CS={x:number;y:number;vx:number;vy:number;ang:number};
type SS=CS&{trail:Pt[]};

export default function Home(){
  const router=useRouter();
  const cvsRef=useRef<HTMLCanvasElement>(null);
  const shipRef=useRef({x:0,y:0,vx:0,vy:0,ang:0,spd:0,ready:false});
  const keysRef=useRef<Record<string,boolean>>({});
  const wakeRef=useRef<{wx:number;wy:number;age:number;ma:number}[]>([]);
  const trailRef=useRef<Pt[]>([]);
  const tickRef=useRef(0);
  const animRef=useRef(0);
  const islesRef=useRef<Isle[]>([]);
  const nearRef=useRef<Isle|null>(null);
  const whalesRef=useRef<CS[]>([]);
  const turtlesRef=useRef<CS[]>([]);
  const serpRef=useRef<SS>({x:0,y:0,vx:0,vy:0,ang:0,trail:[]});
  const creatureInitRef=useRef(false);
  const gameStartRef=useRef(0);
  const [near,setNear]=useState<string|null>(null);
  const [showTutorial,setShowTutorial]=useState(false);
  const [screen,setScreen]=useState<'loading'|'splash'|'game'>('splash');
  const [progress,setProgress]=useState(0);
  const [loadText,setLoadText]=useState('Creating Map');

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    if(params.get('go')==='game'){
      // Remove the param from URL so a reload starts at splash
      window.history.replaceState({},'','/');
      setScreen('game');
      return;
    }
    // All other loads start at splash
  },[]);

  useEffect(()=>{
    if(screen!=='game')return;
    gameStartRef.current=Date.now();
    setShowTutorial(true);
    const canvas=cvsRef.current!,ctx=canvas.getContext('2d')!;

    function resize(){
      canvas.width=window.innerWidth;canvas.height=window.innerHeight;
      if(!shipRef.current.ready){shipRef.current.x=canvas.width*0.5;shipRef.current.y=canvas.height*0.68;shipRef.current.ready=true;}
      if(!creatureInitRef.current){
        creatureInitRef.current=true;
        const W=canvas.width,H=canvas.height;
        whalesRef.current=[
          {x:W*0.12,y:H*0.18,vx:1.1,vy:0.2,ang:0},
          {x:W*0.82,y:H*0.25,vx:-1.0,vy:0.18,ang:Math.PI},
          {x:W*0.18,y:H*0.72,vx:0.9,vy:-0.22,ang:0},
          {x:W*0.75,y:H*0.78,vx:-0.85,vy:-0.18,ang:Math.PI},
        ];
        turtlesRef.current=Array.from({length:5},(_,i)=>({
          x:W*(0.12+i*0.19),y:H*(0.18+(i%2)*0.45),
          vx:(i%2===0?0.4:-0.38),vy:Math.sin(i*1.3)*0.14,
          ang:i%2===0?0:Math.PI,
        }));
        serpRef.current={x:W*0.32,y:H*0.55,vx:0.65,vy:0.1,ang:0,trail:[]};
      }
    }
    resize();window.addEventListener('resize',resize);

    const kd=(e:KeyboardEvent)=>{
      if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault();
      keysRef.current[e.key]=true;
      if((e.key==='e'||e.key==='E')&&nearRef.current){if(nearRef.current.id==='home')setScreen('splash');else router.push(ROUTES[nearRef.current.id]);}
    };
    const ku=(e:KeyboardEvent)=>{keysRef.current[e.key]=false;};
    window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);

    function onClick(e:MouseEvent){
      const rect=canvas.getBoundingClientRect(),cx=e.clientX-rect.left,cy=e.clientY-rect.top;
      for(const isle of islesRef.current){if(Math.hypot(cx-isle.x,cy-isle.y)<isle.r*0.85){if(isle.id==='home')setScreen('splash');else router.push(ROUTES[isle.id]);return;}}
    }
    function onMove(e:MouseEvent){
      const rect=canvas.getBoundingClientRect(),mx=e.clientX-rect.left,my=e.clientY-rect.top;
      canvas.style.cursor=islesRef.current.some(i=>Math.hypot(mx-i.x,my-i.y)<i.r*0.85)?'pointer':'default';
    }
    canvas.addEventListener('click',onClick);canvas.addEventListener('mousemove',onMove);

    // ── Creature steering ──
    function steer(s:CS,maxSpd:number,isles:Isle[],W:number,H:number){
      // Island avoidance
      isles.forEach(isle=>{
        const dx=s.x-isle.x,dy=s.y-isle.y;
        const dist=Math.hypot(dx,dy);
        const avoidR=isle.r*1.9;
        if(dist<avoidR&&dist>1){
          const f=Math.pow((avoidR-dist)/avoidR,2)*maxSpd*3;
          s.vx+=(dx/dist)*f;s.vy+=(dy/dist)*f*0.55;
        }
      });
      // Wrap edges
      if(s.x<-80)s.x=W+80;else if(s.x>W+80)s.x=-80;
      if(s.y<-80)s.y=H+80;else if(s.y>H+80)s.y=-80;
      // Speed clamp + maintain minimum
      const spd=Math.hypot(s.vx,s.vy);
      if(spd>maxSpd){s.vx=s.vx/spd*maxSpd;s.vy=s.vy/spd*maxSpd;}
      else if(spd<maxSpd*0.4&&spd>0){const b=maxSpd*0.02;s.vx+=s.vx/spd*b;s.vy+=s.vy/spd*b;}
      if(spd>0.05)s.ang=Math.atan2(s.vy,s.vx);
      s.x+=s.vx;s.y+=s.vy;
    }

    // ── Ocean ──
    function drawOcean(W:number,H:number){
      ctx.fillStyle='#0b1d35';ctx.fillRect(0,0,W,H);
      const dg=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*0.7);
      dg.addColorStop(0,'rgba(10,40,80,0)');dg.addColorStop(1,'rgba(0,10,30,0.55)');
      ctx.fillStyle=dg;ctx.fillRect(0,0,W,H);
      const rh=52,nr=Math.ceil(H/rh)+2;
      for(let r=-1;r<nr;r++){
        const sy=r*rh,ph=tickRef.current*0.008+r*0.9;
        ctx.beginPath();
        for(let x=-20;x<W+20;x+=5){const y=sy+9*Math.sin(x*0.014+ph)+4*Math.sin(x*0.023-ph*1.2);x===-20?ctx.moveTo(x,y):ctx.lineTo(x,y);}
        ctx.strokeStyle=`rgba(90,170,240,${Math.max(0,0.038+0.025*Math.sin(r*2.3+tickRef.current*0.009))})`;ctx.lineWidth=1.5;ctx.stroke();
      }
      FOAM.forEach(f=>{
        const sx=f.pX*W,sy=f.pY*H,a=Math.max(0,Math.sin(tickRef.current*0.04+f.ph))*0.28;
        if(a<0.03)return;ctx.beginPath();ctx.arc(sx,sy,f.sz,0,Math.PI*2);ctx.fillStyle=`rgba(190,225,255,${a})`;ctx.fill();
      });
    }

    function drawTrail(){
      const trail=trailRef.current;if(trail.length<2)return;
      for(let i=1;i<trail.length;i++){if(i%3!==0)continue;const life=i/trail.length;ctx.beginPath();ctx.arc(trail[i].x,trail[i].y,2,0,Math.PI*2);ctx.fillStyle=`rgba(140,200,255,${life*0.3})`;ctx.fill();}
    }

    function getTide(){return 0.5+0.5*Math.sin(tickRef.current*0.003);}

    // ── Scattered Shipwrecks ──
    function drawWrecks(W:number,H:number){
      WRECKS.forEach((wr,i)=>{
        const wx=wr.pX*W,wy=wr.pY*H;
        if(islesRef.current.some(isle=>Math.hypot(wx-isle.x,wy-isle.y)<isle.r*1.4))return;
        ctx.save();ctx.translate(wx,wy);ctx.rotate(wr.rot);ctx.globalAlpha=0.52;
        const s=wr.sz;
        ctx.beginPath();ctx.moveTo(-28*s,2*s);ctx.bezierCurveTo(-28*s,13*s,28*s,13*s,28*s,2*s);ctx.closePath();ctx.fillStyle='#3a1e06';ctx.fill();ctx.strokeStyle='#1e0e02';ctx.lineWidth=1.2;ctx.stroke();
        ctx.beginPath();ctx.moveTo(-4*s,2*s);ctx.lineTo(-9*s,-20*s);ctx.strokeStyle='#5a2e08';ctx.lineWidth=3*s;ctx.stroke();
        ctx.beginPath();ctx.moveTo(-9*s,-20*s);ctx.lineTo(10*s,-11*s);ctx.strokeStyle='#5a2e08';ctx.lineWidth=2*s;ctx.stroke();
        ctx.beginPath();ctx.moveTo(-9*s,-20*s);ctx.lineTo(14*s,2*s);ctx.strokeStyle='rgba(80,40,10,0.35)';ctx.lineWidth=1;ctx.stroke();
        for(let b=0;b<6;b++){ctx.beginPath();ctx.arc((-20+b*8)*s,9*s,2*s,0,Math.PI*2);ctx.fillStyle='#6a6840';ctx.fill();}
        for(let sw=0;sw<3;sw++){ctx.beginPath();ctx.moveTo((-10+sw*10)*s,5*s);for(let p=0;p<5;p++)ctx.lineTo((-10+sw*10)*s+Math.sin(tickRef.current*0.015+p+sw+i)*5*s,(5+p*5)*s);ctx.strokeStyle='rgba(30,160,60,0.4)';ctx.lineWidth=1.5;ctx.stroke();}
        ctx.restore();
      });
    }

    // ── Tidepools ──
    function drawTidepools(isle:Isle){
      const{x,y,r}=isle;const tick=tickRef.current;const tide=getTide();
      for(let rk=0;rk<12;rk++){
        const rka=(rk/12)*Math.PI*2,rkr=r*(0.88+Math.sin(rk*2.1)*0.07);
        const rkx=x+Math.cos(rka)*rkr,rky=y+Math.sin(rka)*rkr*0.62;
        const rsz=r*(0.065+Math.sin(rk*1.5)*0.025);
        // Rock
        ctx.beginPath();ctx.ellipse(rkx,rky,rsz,rsz*0.6,rka,0,Math.PI*2);ctx.fillStyle='rgba(70,60,50,0.65)';ctx.fill();ctx.strokeStyle='rgba(50,42,35,0.4)';ctx.lineWidth=1;ctx.stroke();
        // Pool water
        const pvis=Math.max(0,Math.min(1,tide*2-0.3));
        ctx.beginPath();ctx.ellipse(rkx,rky,rsz*0.68,rsz*0.42,rka,0,Math.PI*2);ctx.fillStyle=`rgba(30,110,180,${pvis*0.6})`;ctx.fill();
        // Pool shimmer
        if(pvis>0.4&&Math.sin(tick*0.06+rk)>0.2){ctx.beginPath();ctx.arc(rkx+rsz*0.1,rky-rsz*0.1,rsz*0.12,0,Math.PI*2);ctx.fillStyle=`rgba(160,220,255,${pvis*0.45})`;ctx.fill();}
        // Starfish (every 3rd)
        if(rk%3===0&&pvis>0.3){
          ctx.save();ctx.translate(rkx,rky);ctx.rotate(rka+tick*0.002);ctx.globalAlpha=pvis*0.8;
          for(let arm=0;arm<5;arm++){const aa=(arm/5)*Math.PI*2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(aa)*rsz*0.42,Math.sin(aa)*rsz*0.26);ctx.strokeStyle='#dd4828';ctx.lineWidth=2.2;ctx.stroke();}
          ctx.beginPath();ctx.arc(0,0,rsz*0.11,0,Math.PI*2);ctx.fillStyle='#dd4828';ctx.fill();ctx.restore();
        }
        // Anemone (every 4th)
        if(rk%4===1&&pvis>0.4){
          ctx.save();ctx.translate(rkx-rsz*0.2,rky);ctx.globalAlpha=pvis*0.7;
          for(let t=0;t<9;t++){const ta=(t/9)*Math.PI*2+Math.sin(tick*0.025)*0.35;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(ta)*rsz*0.38,Math.sin(ta)*rsz*0.24);ctx.strokeStyle='#a828c8';ctx.lineWidth=1.6;ctx.stroke();ctx.beginPath();ctx.arc(Math.cos(ta)*rsz*0.38,Math.sin(ta)*rsz*0.24,rsz*0.07,0,Math.PI*2);ctx.fillStyle='#c840e8';ctx.fill();}
          ctx.restore();
        }
        // Hermit crab (every 5th)
        if(rk%5===2&&pvis>0.3){
          const cx2=rkx+rsz*0.15,cy2=rky+rsz*0.05;
          ctx.save();ctx.translate(cx2,cy2);ctx.rotate(tick*0.01+rk);ctx.globalAlpha=pvis*0.75;
          ctx.beginPath();ctx.ellipse(0,0,rsz*0.22,rsz*0.16,0,0,Math.PI*2);ctx.fillStyle='#c85828';ctx.fill();
          ctx.beginPath();ctx.arc(rsz*0.2,0,rsz*0.12,0,Math.PI*2);ctx.fillStyle='#e07840';ctx.fill();
          ctx.restore();
        }
      }
      // Foam tide line
      ctx.beginPath();ctx.ellipse(x,y,r*0.94,r*0.585,0,0,Math.PI*2);
      ctx.strokeStyle=`rgba(200,230,255,${0.12+tide*0.22})`;ctx.lineWidth=3.5;ctx.setLineDash([5,8]);ctx.stroke();ctx.setLineDash([]);
    }

    // ── Global Birds ──
    function drawBirds(W:number,H:number){
      const tick=tickRef.current;
      BIRD_FLOCKS.forEach((flock,fi)=>{
        const bx=((flock.pX+tick*flock.speed*flock.dir)%1.3-0.15)*W;
        const by=(flock.pY+Math.sin(tick*0.007+flock.phase)*0.038)*H;
        for(let b=0;b<flock.count;b++){
          const ox=b*(flock.dir*24)-flock.count*12,oy=Math.abs(b-flock.count/2)*8+Math.sin(b*0.9)*3;
          const wing=Math.sin(tick*0.19+b*0.55+flock.phase)*0.5;
          ctx.save();ctx.translate(bx+ox,by+oy);if(flock.dir<0)ctx.scale(-1,1);ctx.globalAlpha=0.52;
          ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-7,-4-wing*9,-12,-2+wing*4);ctx.strokeStyle='rgba(70,70,95,0.85)';ctx.lineWidth=1.6;ctx.stroke();
          ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(7,-4-wing*9,12,-2+wing*4);ctx.strokeStyle='rgba(70,70,95,0.85)';ctx.lineWidth=1.6;ctx.stroke();
          ctx.restore();
        }
      });
    }

    // ── Island Walkers ──
    function drawWalker(wx:number,wy:number,facing:number,tick:number,shirt:string,pants:string){
      ctx.save();ctx.translate(wx,wy);if(facing<0)ctx.scale(-1,1);
      const legSwing=Math.sin(tick*0.15)*0.35;
      // Shadow
      ctx.beginPath();ctx.ellipse(0,14,7,3,0,0,Math.PI*2);ctx.fillStyle='rgba(0,0,0,0.15)';ctx.fill();
      // Legs / pants
      ctx.strokeStyle=pants;ctx.lineWidth=3;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(-1,6);ctx.lineTo(-4+legSwing*6,14);ctx.stroke();
      ctx.beginPath();ctx.moveTo(1,6);ctx.lineTo(4-legSwing*6,14);ctx.stroke();
      // Shoes
      ctx.beginPath();ctx.ellipse(-4+legSwing*6,15,3,1.5,0,0,Math.PI*2);ctx.fillStyle='#1a1a1a';ctx.fill();
      ctx.beginPath();ctx.ellipse(4-legSwing*6,15,3,1.5,0,0,Math.PI*2);ctx.fill();
      // Body / shirt
      ctx.beginPath();ctx.rect(-4,-4,8,10);ctx.fillStyle=shirt;ctx.fill();ctx.strokeStyle='rgba(0,0,0,0.1)';ctx.lineWidth=0.5;ctx.stroke();
      // Arms
      ctx.strokeStyle=shirt;ctx.lineWidth=2.5;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(-4,0);ctx.lineTo(-9,-legSwing*5);ctx.stroke();
      ctx.beginPath();ctx.moveTo(4,0);ctx.lineTo(9,legSwing*5);ctx.stroke();
      // Hands
      ctx.beginPath();ctx.arc(-9,-legSwing*5,1.5,0,Math.PI*2);ctx.fillStyle='#f0c89a';ctx.fill();
      ctx.beginPath();ctx.arc(9,legSwing*5,1.5,0,Math.PI*2);ctx.fill();
      // Head
      ctx.beginPath();ctx.arc(0,-8,5,0,Math.PI*2);ctx.fillStyle='#f0c89a';ctx.fill();ctx.strokeStyle='rgba(0,0,0,0.1)';ctx.lineWidth=0.8;ctx.stroke();
      // Eyes
      ctx.beginPath();ctx.arc(2,-9,0.9,0,Math.PI*2);ctx.fillStyle='#333';ctx.fill();
      // Hair — dark brown
      ctx.beginPath();ctx.arc(0,-12,5,Math.PI,0);ctx.fillStyle='#3a2010';ctx.fill();
      ctx.restore();
    }

    function drawAllWalkers(isles:Isle[],tick:number){
      isles.forEach(isle=>{
        const walkers=ISLAND_WALKERS[isle.id];
        if(!walkers)return;
        walkers.forEach((w,wi)=>{
          const angle=w.angle+tick*w.speed*w.side;
          const wx=isle.x+Math.cos(angle)*isle.r*0.76;
          const wy=isle.y+Math.sin(angle)*isle.r*0.47;
          const facing=w.side*Math.cos(angle)>0?1:-1;
          drawWalker(wx,wy,facing,tick+wi*20,w.shirt,w.pants);
        });
      });
    }

    // ── Cat on home island ──
    function drawCat(isle:Isle,tick:number){
      const angle=CAT.angle+tick*CAT.speed;
      const cx2=isle.x+Math.cos(angle)*isle.r*0.38;
      const cy2=isle.y+Math.sin(angle)*isle.r*0.24;
      const facing=Math.cos(angle+0.01)>Math.cos(angle)?1:-1;
      const sitting=Math.sin(tick*0.04)>0.6;// occasionally sits
      ctx.save();ctx.translate(cx2,cy2);if(facing<0)ctx.scale(-1,1);
      // Shadow
      ctx.beginPath();ctx.ellipse(0,sitting?6:8,8,3,0,0,Math.PI*2);ctx.fillStyle='rgba(0,0,0,0.15)';ctx.fill();
      if(sitting){
        // Sitting cat
        // Body (rounded blob)
        ctx.beginPath();ctx.ellipse(0,2,7,8,0,0,Math.PI*2);ctx.fillStyle='#888';ctx.fill();
        // Head
        ctx.beginPath();ctx.arc(0,-7,6,0,Math.PI*2);ctx.fillStyle='#999';ctx.fill();
        // Ears
        ctx.beginPath();ctx.moveTo(-5,-11);ctx.lineTo(-3,-16);ctx.lineTo(0,-12);ctx.fillStyle='#888';ctx.fill();
        ctx.beginPath();ctx.moveTo(5,-11);ctx.lineTo(3,-16);ctx.lineTo(0,-12);ctx.fillStyle='#888';ctx.fill();
        // Inner ears
        ctx.beginPath();ctx.moveTo(-4,-12);ctx.lineTo(-3,-15);ctx.lineTo(-1,-12);ctx.fillStyle='#ffaaaa';ctx.fill();
        ctx.beginPath();ctx.moveTo(4,-12);ctx.lineTo(3,-15);ctx.lineTo(1,-12);ctx.fillStyle='#ffaaaa';ctx.fill();
        // Face
        ctx.beginPath();ctx.arc(-2,-7,1.2,0,Math.PI*2);ctx.fillStyle='#222';ctx.fill();// left eye
        ctx.beginPath();ctx.arc(2,-7,1.2,0,Math.PI*2);ctx.fillStyle='#222';ctx.fill();// right eye
        ctx.beginPath();ctx.arc(-1.5,-6.5,0.5,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();// shine
        ctx.beginPath();ctx.arc(2.5,-6.5,0.5,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
        ctx.beginPath();ctx.arc(0,-5,1.5,0,Math.PI*2);ctx.fillStyle='#ffaaaa';ctx.fill();// nose
        // Whiskers
        ctx.strokeStyle='rgba(255,255,255,0.7)';ctx.lineWidth=0.8;
        ctx.beginPath();ctx.moveTo(-2,-4);ctx.lineTo(-9,-5);ctx.stroke();ctx.beginPath();ctx.moveTo(-2,-4);ctx.lineTo(-9,-3);ctx.stroke();
        ctx.beginPath();ctx.moveTo(2,-4);ctx.lineTo(9,-5);ctx.stroke();ctx.beginPath();ctx.moveTo(2,-4);ctx.lineTo(9,-3);ctx.stroke();
        // Tail curled
        ctx.beginPath();ctx.arc(8,4,6,Math.PI*0.5,Math.PI*1.8);ctx.strokeStyle='#888';ctx.lineWidth=3;ctx.stroke();
      } else {
        // Walking cat
        const legA=Math.sin(tick*0.18)*0.4;
        // Body
        ctx.beginPath();ctx.ellipse(2,2,9,5,0.15,0,Math.PI*2);ctx.fillStyle='#888';ctx.fill();
        // Head
        ctx.beginPath();ctx.arc(10,-1,5,0,Math.PI*2);ctx.fillStyle='#999';ctx.fill();
        // Ears
        ctx.beginPath();ctx.moveTo(7,-5);ctx.lineTo(8,-9);ctx.lineTo(10,-5);ctx.fillStyle='#888';ctx.fill();
        ctx.beginPath();ctx.moveTo(12,-5);ctx.lineTo(13,-9);ctx.lineTo(15,-5);ctx.fillStyle='#888';ctx.fill();
        // Eye
        ctx.beginPath();ctx.arc(12,-1,1.2,0,Math.PI*2);ctx.fillStyle='#222';ctx.fill();ctx.beginPath();ctx.arc(12.5,-1.5,0.5,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
        // Nose
        ctx.beginPath();ctx.arc(15,0,1,0,Math.PI*2);ctx.fillStyle='#ffaaaa';ctx.fill();
        // Legs
        ctx.strokeStyle='#777';ctx.lineWidth=2.5;ctx.lineCap='round';
        ctx.beginPath();ctx.moveTo(-2,5);ctx.lineTo(-3+legA*5,12);ctx.stroke();
        ctx.beginPath();ctx.moveTo(2,5);ctx.lineTo(3-legA*5,12);ctx.stroke();
        ctx.beginPath();ctx.moveTo(6,5);ctx.lineTo(5+legA*5,12);ctx.stroke();
        ctx.beginPath();ctx.moveTo(9,5);ctx.lineTo(10-legA*5,12);ctx.stroke();
        // Tail
        const tailWag=Math.sin(tick*0.12)*15;
        ctx.beginPath();ctx.moveTo(-7,2);ctx.quadraticCurveTo(-15+tailWag,-5,-12+tailWag,-12);ctx.strokeStyle='#888';ctx.lineWidth=3;ctx.stroke();
      }
      ctx.restore();
    }

    // ── Whale (faces direction of travel) ──
    function drawWhale(s:CS,tick:number){
      ctx.save();ctx.translate(s.x,s.y);ctx.rotate(s.ang);// faces +x when ang=0
      // Body
      ctx.beginPath();ctx.ellipse(0,0,46,18,0,0,Math.PI*2);ctx.fillStyle='#3a5a72';ctx.fill();
      // Belly
      ctx.beginPath();ctx.ellipse(8,5,30,11,0,0,Math.PI*2);ctx.fillStyle='rgba(200,218,230,0.45)';ctx.fill();
      // Flipper (bottom of screen = -y since rotated)
      ctx.beginPath();ctx.moveTo(-8,8);ctx.lineTo(-22,22);ctx.lineTo(-4,16);ctx.fillStyle='#2a4a60';ctx.fill();
      // Dorsal fin (top)
      ctx.beginPath();ctx.moveTo(5,-18);ctx.lineTo(-4,-10);ctx.lineTo(10,-6);ctx.closePath();ctx.fillStyle='#2a4a60';ctx.fill();
      // Tail (left = behind)
      ctx.beginPath();ctx.moveTo(-46,0);ctx.lineTo(-58,-13);ctx.lineTo(-52,0);ctx.lineTo(-58,13);ctx.closePath();ctx.fillStyle='#2a4a60';ctx.fill();
      // Eye (right = front)
      ctx.beginPath();ctx.arc(28,-4,3.5,0,Math.PI*2);ctx.fillStyle='#111';ctx.fill();ctx.beginPath();ctx.arc(29,-5,1.2,0,Math.PI*2);ctx.fillStyle='white';ctx.fill();
      // Blow spout when near surface
      if(Math.sin(tick*0.008+s.x*0.001)>0.7){
        const sa=(Math.sin(tick*0.008+s.x*0.001)-0.7)/0.3;
        for(let sp=0;sp<5;sp++){ctx.beginPath();ctx.moveTo(15,-18);ctx.lineTo(15+Math.sin(sp*1.2)*9*sa,(-18-sp*15*sa));ctx.strokeStyle=`rgba(200,240,255,${sa*0.65})`;ctx.lineWidth=2.2;ctx.stroke();}
      }
      ctx.restore();
    }

    // ── Sea Turtle (faces direction) ──
    function drawTurtle(s:CS,tick:number){
      ctx.save();ctx.translate(s.x,s.y);ctx.rotate(s.ang);
      // Shell
      ctx.beginPath();ctx.ellipse(0,0,13,10,0,0,Math.PI*2);ctx.fillStyle='#3a7a30';ctx.fill();ctx.strokeStyle='#1a5010';ctx.lineWidth=1.2;ctx.stroke();
      // Shell hex pattern
      for(let sc=0;sc<4;sc++){const sa=(sc/4)*Math.PI*2;ctx.beginPath();ctx.arc(Math.cos(sa)*6,Math.sin(sa)*4.5,3.5,0,Math.PI*2);ctx.strokeStyle='rgba(0,0,0,0.18)';ctx.lineWidth=0.8;ctx.stroke();}
      ctx.beginPath();ctx.arc(0,0,3.5,0,Math.PI*2);ctx.strokeStyle='rgba(0,0,0,0.18)';ctx.lineWidth=0.8;ctx.stroke();
      // Head (right = front)
      ctx.beginPath();ctx.ellipse(17,0,6,4.5,0,0,Math.PI*2);ctx.fillStyle='#4a8a38';ctx.fill();
      // Eyes on head
      ctx.beginPath();ctx.arc(20,-2.5,1.8,0,Math.PI*2);ctx.fillStyle='#111';ctx.fill();ctx.beginPath();ctx.arc(21,-3,0.7,0,Math.PI*2);ctx.fillStyle='white';ctx.fill();
      ctx.beginPath();ctx.arc(20,2.5,1.8,0,Math.PI*2);ctx.fillStyle='#111';ctx.fill();
      // 4 flippers
      const fa=Math.sin(tick*0.08+s.x*0.002)*0.6;
      [[8,12,fa],[8,-12,-fa],[-6,11,-fa],[-6,-11,fa]].forEach(([fx,fy,fa2])=>{
        ctx.beginPath();ctx.moveTo(fx as number,fy as number);ctx.lineTo((fx as number)+16*Math.cos(fa2 as number),(fy as number)+16*Math.sin(fa2 as number));ctx.lineTo((fx as number)+8,fy as number);ctx.fillStyle='#3a7a30';ctx.fill();
      });
      // Tail (left = behind)
      ctx.beginPath();ctx.ellipse(-15,0,4,2.5,0,0,Math.PI*2);ctx.fillStyle='#2a6020';ctx.fill();
      ctx.restore();
    }

    // ── Sea Serpent ──
    function updateSerpent(W:number,H:number){
      const s=serpRef.current;
      steer(s,0.65,islesRef.current,W,H);
      s.trail.unshift({x:s.x,y:s.y});
      if(s.trail.length>120)s.trail.pop();
    }
    function drawSerpent(){
      const s=serpRef.current,trail=s.trail;if(trail.length<20)return;
      const tick=tickRef.current;
      // Draw body segments along trail
      for(let seg=2;seg<Math.min(trail.length-1,100);seg+=2){
        if(seg%4!==0)continue;// draw every other visible segment
        const pt=trail[seg];const life=1-seg/100;
        const segR=10*life;
        if(seg%8===0){// above water
          ctx.beginPath();ctx.arc(pt.x,pt.y,segR,0,Math.PI*2);ctx.fillStyle=`rgba(28,80,35,${life*0.85})`;ctx.fill();ctx.strokeStyle=`rgba(15,55,20,${life*0.5})`;ctx.lineWidth=1;ctx.stroke();
          // Scale pattern
          ctx.beginPath();ctx.arc(pt.x,pt.y,segR*0.55,0,Math.PI*2);ctx.strokeStyle=`rgba(0,0,0,0.12)`;ctx.lineWidth=0.8;ctx.stroke();
        }
      }
      // Head
      ctx.save();ctx.translate(s.x,s.y);ctx.rotate(s.ang);
      ctx.beginPath();ctx.ellipse(0,0,13,9,0,0,Math.PI*2);ctx.fillStyle='#1e6028';ctx.fill();ctx.strokeStyle='#0e3a18';ctx.lineWidth=1.2;ctx.stroke();
      ctx.beginPath();ctx.arc(-5,-4,2.8,0,Math.PI*2);ctx.fillStyle='#ffee00';ctx.fill();ctx.beginPath();ctx.arc(-4.5,-4,1.1,0,Math.PI*2);ctx.fillStyle='#111';ctx.fill();
      ctx.beginPath();ctx.arc(-5,4,2.8,0,Math.PI*2);ctx.fillStyle='#ffee00';ctx.fill();ctx.beginPath();ctx.arc(-4.5,4,1.1,0,Math.PI*2);ctx.fillStyle='#111';ctx.fill();
      // Tongue
      if(Math.sin(tick*0.06)>0.4){ctx.beginPath();ctx.moveTo(13,0);ctx.lineTo(20,-3);ctx.moveTo(13,0);ctx.lineTo(20,3);ctx.strokeStyle='#ff3030';ctx.lineWidth=1.8;ctx.stroke();}
      ctx.restore();
    }

    // ── ISLAND CONTENT ──
    function drawIsle(isle:Isle){
      const{x,y,r,name,lbl,theme}=isle;
      const t=THEMES[theme];const tick=tickRef.current;const tide=getTide();

      // ── Entrance animation ──
      const elapsed=(Date.now()-gameStartRef.current)/1000;
      const isleIndex=ISLE_DATA.findIndex(d=>d.id===isle.id);
      const delay=isleIndex*0.18;// stagger each island
      const dur=0.7;
      const animT=Math.max(0,Math.min(1,(elapsed-delay)/dur));
      // Ease out cubic
      const ease=1-Math.pow(1-animT,3);
      if(ease<0.01)return;
      ctx.save();
      ctx.globalAlpha=ease;
      ctx.translate(x,y);ctx.scale(0.3+ease*0.7,0.3+ease*0.7);ctx.translate(-x,-y);

      drawTidepools(isle);

      const tideOff=tide*r*0.045;
      ctx.save();ctx.shadowColor='rgba(0,0,0,0.55)';ctx.shadowBlur=28;ctx.shadowOffsetX=7;ctx.shadowOffsetY=10;
      ctx.beginPath();ctx.ellipse(x,y,r,r*0.62-tideOff*0.1,0,0,Math.PI*2);ctx.fillStyle=t.sand;ctx.fill();ctx.restore();
      const sg2=ctx.createRadialGradient(x-r*0.2,y-r*0.15,r*0.1,x,y,r);sg2.addColorStop(0,'rgba(255,255,255,0.1)');sg2.addColorStop(1,'rgba(0,0,0,0.22)');
      ctx.beginPath();ctx.ellipse(x,y,r,r*0.62-tideOff*0.1,0,0,Math.PI*2);ctx.fillStyle=sg2;ctx.fill();

      ctx.beginPath();ctx.ellipse(x,y,r,r*0.62,0,0,Math.PI*2);ctx.fillStyle=t.top;ctx.fill();
      const tg2=ctx.createRadialGradient(x-r*0.15,y-r*0.2,r*0.05,x,y,r);tg2.addColorStop(0,'rgba(255,255,255,0.1)');tg2.addColorStop(1,'rgba(0,0,0,0.18)');
      ctx.beginPath();ctx.ellipse(x,y,r,r*0.62,0,0,Math.PI*2);ctx.fillStyle=tg2;ctx.fill();

      // ── Walkers and cat drawn HERE so buildings paint over them ──
      const isleWalkers=ISLAND_WALKERS[isle.id];
      if(isleWalkers){
        isleWalkers.forEach((w,wi)=>{
          const angle=w.angle+tick*w.speed*w.side;
          const wx2=x+Math.cos(angle)*r*0.76;
          const wy2=y+Math.sin(angle)*r*0.47;
          const facing=w.side*Math.cos(angle)>0?1:-1;
          drawWalker(wx2,wy2,facing,tick+wi*20,w.shirt,w.pants);
        });
      }
      if(isle.id==='home') drawCat(isle,tick);

      if(theme==='emerald'){
        // HOME ISLAND — one cozy detailed house
        // Lawn / yard
        ctx.beginPath();ctx.ellipse(x,y+r*0.08,r*0.62,r*0.38,0,0,Math.PI*2);ctx.fillStyle='rgba(50,160,50,0.35)';ctx.fill();

        // Stone garden path from door to beach
        for(let sp=0;sp<7;sp++){
          const spx=x-r*0.02+Math.sin(sp*0.8)*r*0.04,spy=y+r*0.18+sp*r*0.06;
          ctx.beginPath();ctx.ellipse(spx,spy,r*0.04,r*0.025,sp*0.4,0,Math.PI*2);ctx.fillStyle=`rgba(180,160,120,${0.55-sp*0.04})`;ctx.fill();
          ctx.strokeStyle='rgba(140,120,90,0.3)';ctx.lineWidth=0.8;ctx.stroke();
        }

        // House foundation / base
        ctx.beginPath();ctx.rect(x-r*0.38,y-r*0.22,r*0.76,r*0.4);ctx.fillStyle='#b8a080';ctx.fill();
        ctx.strokeStyle='#8a7050';ctx.lineWidth=1.5;ctx.stroke();

        // Main house body — warm cream/yellow
        ctx.beginPath();ctx.rect(x-r*0.36,y-r*0.42,r*0.72,r*0.42);
        const hbg=ctx.createLinearGradient(x,y-r*0.42,x,y);hbg.addColorStop(0,'#f5e8c0');hbg.addColorStop(1,'#e8d4a0');
        ctx.fillStyle=hbg;ctx.fill();ctx.strokeStyle='#c8a860';ctx.lineWidth=1.5;ctx.stroke();
        // Horizontal wood siding lines
        for(let sd=0;sd<7;sd++){ctx.beginPath();ctx.moveTo(x-r*0.36,y-r*0.37+sd*r*0.06);ctx.lineTo(x+r*0.36,y-r*0.37+sd*r*0.06);ctx.strokeStyle='rgba(0,0,0,0.06)';ctx.lineWidth=1;ctx.stroke();}

        // Steeply pitched main roof — dark red
        ctx.beginPath();ctx.moveTo(x-r*0.42,y-r*0.42);ctx.lineTo(x,y-r*0.75);ctx.lineTo(x+r*0.42,y-r*0.42);ctx.closePath();
        const rfg=ctx.createLinearGradient(x,y-r*0.75,x,y-r*0.42);rfg.addColorStop(0,'#8a2010');rfg.addColorStop(1,'#c03820');ctx.fillStyle=rfg;ctx.fill();ctx.strokeStyle='#7a1a08';ctx.lineWidth=1.5;ctx.stroke();
        // Roof shingles texture
        for(let row=0;row<5;row++){
          const ry=y-r*0.42-row*r*0.067;const rw=r*0.42*(1-row/5)*1.02;
          for(let sh=0;sh<Math.floor(row*2+3);sh++){
            const sw=rw*2/(row*2+3);const sx2=x-rw+sh*sw;
            ctx.beginPath();ctx.rect(sx2+1,ry-r*0.067,sw-2,r*0.067);ctx.strokeStyle='rgba(0,0,0,0.1)';ctx.lineWidth=0.5;ctx.stroke();
          }
        }
        // Roof overhang / fascia
        ctx.beginPath();ctx.moveTo(x-r*0.44,y-r*0.42);ctx.lineTo(x+r*0.44,y-r*0.42);ctx.strokeStyle='#f0e8d0';ctx.lineWidth=4;ctx.stroke();

        // Left side gable wing (lower roof)
        ctx.beginPath();ctx.rect(x-r*0.36,y-r*0.32,r*0.22,r*0.32);ctx.fillStyle='#eedca8';ctx.fill();ctx.strokeStyle='#c8a860';ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x-r*0.38,y-r*0.32);ctx.lineTo(x-r*0.25,y-r*0.48);ctx.lineTo(x-r*0.12,y-r*0.32);ctx.closePath();ctx.fillStyle='#a02818';ctx.fill();ctx.strokeStyle='#7a1a08';ctx.lineWidth=1;ctx.stroke();

        // Chimney (left of ridge)
        ctx.beginPath();ctx.rect(x-r*0.14,y-r*0.82,r*0.1,r*0.42);
        const chg=ctx.createLinearGradient(x-r*0.14,0,x-r*0.04,0);chg.addColorStop(0,'#8a4828');chg.addColorStop(1,'#a05838');ctx.fillStyle=chg;ctx.fill();ctx.strokeStyle='#6a3018';ctx.lineWidth=1.2;ctx.stroke();
        // Chimney cap
        ctx.beginPath();ctx.rect(x-r*0.16,y-r*0.84,r*0.14,r*0.03);ctx.fillStyle='#6a3018';ctx.fill();
        // Chimney mortar lines
        for(let cm=0;cm<4;cm++){ctx.beginPath();ctx.moveTo(x-r*0.14,y-r*0.74+cm*r*0.08);ctx.lineTo(x-r*0.04,y-r*0.74+cm*r*0.08);ctx.strokeStyle='rgba(0,0,0,0.12)';ctx.lineWidth=1;ctx.stroke();}
        // Animated smoke
        for(let sm=0;sm<4;sm++){
          const sa=((tick*0.012+sm*0.25)%1);
          const smx=x-r*0.09+Math.sin(tick*0.04+sm*1.2)*r*0.05;
          const smy=y-r*0.84-sa*r*0.28;
          ctx.beginPath();ctx.arc(smx,smy,r*(0.025+sa*0.04),0,Math.PI*2);
          ctx.fillStyle=`rgba(200,195,190,${0.35*(1-sa)})`;ctx.fill();
        }

        // Front porch with columns
        ctx.beginPath();ctx.rect(x-r*0.18,y-r*0.04,r*0.36,r*0.22);ctx.fillStyle='#e8dcc0';ctx.fill();ctx.strokeStyle='#c8aa70';ctx.lineWidth=1;ctx.stroke();
        // Porch roof
        ctx.beginPath();ctx.moveTo(x-r*0.22,y-r*0.04);ctx.lineTo(x,y-r*0.16);ctx.lineTo(x+r*0.22,y-r*0.04);ctx.closePath();ctx.fillStyle='#b03020';ctx.fill();ctx.strokeStyle='#8a1e10';ctx.lineWidth=1;ctx.stroke();
        // Porch columns
        for(let pc=0;pc<3;pc++){
          const pcx=x-r*0.16+pc*r*0.16;
          ctx.beginPath();ctx.rect(pcx-r*0.025,y-r*0.04,r*0.05,r*0.22);
          const pcg=ctx.createLinearGradient(pcx-r*0.025,0,pcx+r*0.025,0);pcg.addColorStop(0,'#f5f0e0');pcg.addColorStop(0.5,'#e8e0c8');pcg.addColorStop(1,'#f0ead8');ctx.fillStyle=pcg;ctx.fill();ctx.strokeStyle='#c8a860';ctx.lineWidth=0.8;ctx.stroke();
        }
        // Porch floor boards
        for(let pb=0;pb<5;pb++){ctx.beginPath();ctx.moveTo(x-r*0.18,y+r*0.04+pb*r*0.03);ctx.lineTo(x+r*0.18,y+r*0.04+pb*r*0.03);ctx.strokeStyle='rgba(0,0,0,0.06)';ctx.lineWidth=0.8;ctx.stroke();}
        // Porch steps
        for(let ps=0;ps<3;ps++){ctx.beginPath();ctx.rect(x-r*(0.12-ps*0.02),y+r*0.18+ps*r*0.025,r*(0.24-ps*0.04),r*0.025);ctx.fillStyle=`rgba(200,180,130,${0.8-ps*0.1})`;ctx.fill();}

        // Front door — arched, dark red with brass knocker
        ctx.beginPath();ctx.rect(x-r*0.07,y-r*0.04,r*0.14,r*0.22);ctx.fillStyle='#5a1808';ctx.fill();
        ctx.beginPath();ctx.arc(x,y-r*0.04,r*0.07,Math.PI,0);ctx.fillStyle='#5a1808';ctx.fill();
        ctx.strokeStyle='#c8a050';ctx.lineWidth=2;ctx.stroke();
        // Door panels
        ctx.beginPath();ctx.rect(x-r*0.06,y-r*0.03,r*0.05,r*0.08);ctx.strokeStyle='rgba(200,160,60,0.4)';ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.rect(x+r*0.01,y-r*0.03,r*0.05,r*0.08);ctx.strokeStyle='rgba(200,160,60,0.4)';ctx.lineWidth=1;ctx.stroke();
        // Door knob
        ctx.save();ctx.shadowColor='#ffd060';ctx.shadowBlur=4;ctx.beginPath();ctx.arc(x+r*0.06,y+r*0.06,r*0.018,0,Math.PI*2);ctx.fillStyle='#d4a020';ctx.fill();ctx.restore();
        // Door wreath
        ctx.beginPath();ctx.arc(x,y-r*0.04,r*0.04,0,Math.PI*2);ctx.strokeStyle='#2a8a20';ctx.lineWidth=3;ctx.stroke();
        ctx.beginPath();ctx.arc(x,y-r*0.04,r*0.04,0,Math.PI*2);ctx.strokeStyle='rgba(200,40,20,0.6)';ctx.lineWidth=1.5;ctx.setLineDash([2,4]);ctx.stroke();ctx.setLineDash([]);

        // Large bay window (right of door)
        ctx.beginPath();ctx.rect(x+r*0.1,y-r*0.36,r*0.22,r*0.2);ctx.fillStyle='rgba(180,220,255,0.55)';ctx.fill();ctx.strokeStyle='#c8a860';ctx.lineWidth=2;ctx.stroke();
        // Window panes
        ctx.beginPath();ctx.moveTo(x+r*0.21,y-r*0.36);ctx.lineTo(x+r*0.21,y-r*0.16);ctx.strokeStyle='#c8a860';ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x+r*0.1,y-r*0.26);ctx.lineTo(x+r*0.32,y-r*0.26);ctx.strokeStyle='#c8a860';ctx.lineWidth=1;ctx.stroke();
        // Warm interior glow
        const wglow=Math.sin(tick*0.025)>0;
        ctx.save();ctx.shadowColor='#ffe880';ctx.shadowBlur=wglow?14:6;
        ctx.beginPath();ctx.rect(x+r*0.11,y-r*0.35,r*0.2,r*0.18);ctx.fillStyle=`rgba(255,240,150,${wglow?0.35:0.2})`;ctx.fill();ctx.restore();
        // Window box with flowers
        ctx.beginPath();ctx.rect(x+r*0.08,y-r*0.16,r*0.26,r*0.04);ctx.fillStyle='#8a5028';ctx.fill();
        for(let wf=0;wf<6;wf++){ctx.beginPath();ctx.arc(x+r*0.11+wf*r*0.04,y-r*0.18+Math.sin(tick*0.04+wf)*r*0.008,r*0.02,0,Math.PI*2);ctx.fillStyle=['#ff6080','#ff9020','#ff4060','#ff8040','#e040e0','#ff6040'][wf];ctx.fill();}

        // Left small window (bedroom)
        ctx.beginPath();ctx.rect(x-r*0.32,y-r*0.36,r*0.16,r*0.14);ctx.fillStyle='rgba(180,220,255,0.5)';ctx.fill();ctx.strokeStyle='#c8a860';ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x-r*0.24,y-r*0.36);ctx.lineTo(x-r*0.24,y-r*0.22);ctx.moveTo(x-r*0.32,y-r*0.29);ctx.lineTo(x-r*0.16,y-r*0.29);ctx.strokeStyle='#c8a860';ctx.lineWidth=1;ctx.stroke();
        // Curtains in bedroom window
        ctx.beginPath();ctx.rect(x-r*0.32,y-r*0.36,r*0.04,r*0.14);ctx.fillStyle='rgba(220,160,140,0.5)';ctx.fill();
        ctx.beginPath();ctx.rect(x-r*0.2,y-r*0.36,r*0.04,r*0.14);ctx.fillStyle='rgba(220,160,140,0.5)';ctx.fill();

        // Attic window / dormer
        ctx.beginPath();ctx.rect(x+r*0.05,y-r*0.65,r*0.14,r*0.1);ctx.fillStyle='rgba(180,220,255,0.45)';ctx.fill();ctx.strokeStyle='#c8a860';ctx.lineWidth=1.2;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x+r*0.03,y-r*0.65);ctx.lineTo(x+r*0.12,y-r*0.73);ctx.lineTo(x+r*0.21,y-r*0.65);ctx.closePath();ctx.fillStyle='#b03020';ctx.fill();

        // Garden — left side flower beds
        ctx.beginPath();ctx.ellipse(x-r*0.42,y+r*0.05,r*0.12,r*0.08,0,0,Math.PI*2);ctx.fillStyle='rgba(40,150,40,0.5)';ctx.fill();
        for(let gf=0;gf<8;gf++){
          const gfa=(gf/8)*Math.PI*2,gfr=r*0.08;
          const gfx=x-r*0.42+Math.cos(gfa)*gfr,gfy=y+r*0.05+Math.sin(gfa)*gfr*0.6;
          ctx.beginPath();ctx.arc(gfx,gfy,r*0.022,0,Math.PI*2);ctx.fillStyle=['#ff6080','#ff9020','#ffe040','#ff40a0','#c040ff','#40c0ff','#ff4040','#80ff40'][gf];ctx.fill();
          // Stem
          ctx.beginPath();ctx.moveTo(gfx,gfy);ctx.lineTo(gfx,gfy+r*0.04);ctx.strokeStyle='rgba(30,120,30,0.6)';ctx.lineWidth=1;ctx.stroke();
        }

        // Big oak tree (right side)
        const treeSway=Math.sin(tick*0.02)*r*0.015;
        ctx.beginPath();ctx.moveTo(x+r*0.42,y+r*0.22);ctx.lineTo(x+r*0.42+treeSway*0.3,y-r*0.1);ctx.strokeStyle='#5a3010';ctx.lineWidth=r*0.04;ctx.stroke();
        // Branch
        ctx.beginPath();ctx.moveTo(x+r*0.42+treeSway*0.2,y-r*0.0);ctx.lineTo(x+r*0.55+treeSway,y-r*0.12);ctx.strokeStyle='#5a3010';ctx.lineWidth=r*0.025;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x+r*0.42+treeSway*0.3,y-r*0.08);ctx.lineTo(x+r*0.3+treeSway,y-r*0.18);ctx.strokeStyle='#5a3010';ctx.lineWidth=r*0.02;ctx.stroke();
        // Leafy canopy
        for(let lc=0;lc<5;lc++){
          const lca=(lc/5)*Math.PI*2,lcr=r*(0.18+Math.sin(lc*1.4)*0.04);
          const lcx=x+r*0.42+Math.cos(lca)*lcr+treeSway,lcy=y-r*0.12+Math.sin(lca)*lcr*0.65;
          ctx.beginPath();ctx.arc(lcx,lcy,r*(0.1+Math.sin(lc*2.1)*0.03),0,Math.PI*2);
          ctx.fillStyle=`rgba(${30+lc*8},${130+lc*10},${20+lc*5},0.75)`;ctx.fill();
        }

        // Mailbox by path
        ctx.beginPath();ctx.rect(x+r*0.22,y+r*0.32,r*0.07,r*0.08);ctx.fillStyle='#c03820';ctx.fill();ctx.strokeStyle='#8a1e10';ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.ellipse(x+r*0.255,y+r*0.32,r*0.035,r*0.02,0,Math.PI,0);ctx.fillStyle='#c03820';ctx.fill();
        ctx.beginPath();ctx.rect(x+r*0.254,y+r*0.36,r*0.06,r*0.02);ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fill();
        // Mailbox post
        ctx.beginPath();ctx.rect(x+r*0.24,y+r*0.38,r*0.03,r*0.08);ctx.fillStyle='#8a5020';ctx.fill();

        // Porch light glowing
        ctx.save();ctx.shadowColor='#ffe080';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(x,y-r*0.16,r*0.025,0,Math.PI*2);ctx.fillStyle='#ffe060';ctx.fill();ctx.restore();

        // Welcome mat
        ctx.beginPath();ctx.rect(x-r*0.06,y+r*0.17,r*0.12,r*0.04);ctx.fillStyle='#8a3020';ctx.fill();ctx.strokeStyle='#6a2010';ctx.lineWidth=0.8;ctx.stroke();
        ctx.save();ctx.fillStyle='rgba(255,220,180,0.7)';ctx.font=`bold ${r*0.025}px serif`;ctx.textAlign='center';ctx.fillText('HOME',x,y+r*0.2);ctx.restore();

      } else if(theme==='storm'){
        // BLOG ISLAND — library & reading district
        // Main library — grand neoclassical
        ctx.beginPath();ctx.rect(x-r*0.46,y-r*0.46,r*0.92,r*0.42);
        const libg=ctx.createLinearGradient(x,y-r*0.46,x,y-r*0.04);libg.addColorStop(0,'#e8dca8');libg.addColorStop(1,'#c8b878');ctx.fillStyle=libg;ctx.fill();ctx.strokeStyle='#8a6820';ctx.lineWidth=1.5;ctx.stroke();
        // Brick lines
        for(let br=0;br<5;br++){ctx.beginPath();ctx.moveTo(x-r*0.46,y-r*0.38+br*r*0.07);ctx.lineTo(x+r*0.46,y-r*0.38+br*r*0.07);ctx.strokeStyle='rgba(0,0,0,0.07)';ctx.lineWidth=1;ctx.stroke();}
        // Columns
        for(let lp=0;lp<7;lp++){const lpx=x-r*0.4+lp*r*0.135;ctx.beginPath();ctx.rect(lpx-4,y-r*0.46,8,r*0.42);const pg=ctx.createLinearGradient(lpx-4,0,lpx+4,0);pg.addColorStop(0,'#efe088');pg.addColorStop(0.5,'#d8c870');pg.addColorStop(1,'#e8d880');ctx.fillStyle=pg;ctx.fill();ctx.strokeStyle='rgba(100,80,20,0.3)';ctx.lineWidth=0.8;ctx.stroke();}
        // Pediment
        ctx.beginPath();ctx.moveTo(x-r*0.5,y-r*0.46);ctx.lineTo(x,y-r*0.68);ctx.lineTo(x+r*0.5,y-r*0.46);ctx.closePath();ctx.fillStyle='#e0d098';ctx.fill();ctx.strokeStyle='#8a6820';ctx.lineWidth=1.5;ctx.stroke();
        // Pediment relief art (simple scene)
        ctx.save();ctx.translate(x,y-r*0.56);ctx.scale(1,0.6);
        ctx.beginPath();ctx.arc(-r*0.08,0,r*0.06,0,Math.PI*2);ctx.fillStyle='rgba(160,130,60,0.4)';ctx.fill();// person silhouette
        ctx.beginPath();ctx.arc(r*0.08,0,r*0.06,0,Math.PI*2);ctx.fill();ctx.restore();
        // Library sign
        ctx.save();ctx.fillStyle='#5a3810';ctx.font=`bold ${r*0.09}px Georgia,serif`;ctx.textAlign='center';ctx.shadowColor='rgba(0,0,0,0.3)';ctx.shadowBlur=3;ctx.fillText('LIBRARY',x,y-r*0.22);ctx.restore();
        // Clock above entrance
        ctx.beginPath();ctx.arc(x,y-r*0.58,r*0.07,0,Math.PI*2);ctx.fillStyle='#e8e0c8';ctx.fill();ctx.strokeStyle='#8a6820';ctx.lineWidth=1.5;ctx.stroke();
        const ch=tick*0.005;// clock hour hand
        ctx.beginPath();ctx.moveTo(x,y-r*0.58);ctx.lineTo(x+Math.cos(ch)*r*0.04,y-r*0.58+Math.sin(ch)*r*0.04);ctx.strokeStyle='#333';ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x,y-r*0.58);ctx.lineTo(x+Math.cos(ch*12)*r*0.055,y-r*0.58+Math.sin(ch*12)*r*0.055);ctx.strokeStyle='#333';ctx.lineWidth=1;ctx.stroke();
        // Steps
        for(let ls=0;ls<3;ls++){ctx.beginPath();ctx.rect(x-r*(0.42-ls*0.04),y-r*0.04+ls*r*0.035,r*(0.84-ls*0.08),r*0.035);ctx.fillStyle=`rgba(210,190,110,${0.85-ls*0.1})`;ctx.fill();}

        // Outdoor reading garden (right)
        ctx.beginPath();ctx.ellipse(x-r*0.3,y+r*0.2,r*0.22,r*0.16,0,0,Math.PI*2);ctx.fillStyle='rgba(80,130,40,0.4)';ctx.fill();
        // Reading bench
        for(let rb=0;rb<2;rb++){const rba=(rb/2)*Math.PI+0.5;ctx.beginPath();ctx.rect(x-r*0.3+Math.cos(rba)*r*0.14-r*0.03,y+r*0.2+Math.sin(rba)*r*0.1-r*0.01,r*0.06,r*0.025);ctx.fillStyle='#8a5018';ctx.fill();}
        // Reading lamp post in garden
        ctx.beginPath();ctx.moveTo(x-r*0.3,y+r*0.24);ctx.lineTo(x-r*0.3,y+r*0.08);ctx.strokeStyle='#888';ctx.lineWidth=2;ctx.stroke();
        ctx.save();ctx.shadowColor='#ffe080';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(x-r*0.3,y+r*0.08,3,0,Math.PI*2);ctx.fillStyle='#ffe060';ctx.fill();ctx.restore();

        // Quill pen (static, resting on desk area)
        ctx.save();ctx.translate(x+r*0.3,y+r*0.1);ctx.rotate(-0.65);ctx.globalAlpha=0.85;
        ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-r*0.25);ctx.strokeStyle='#e8d890';ctx.lineWidth=2.5;ctx.stroke();
        ctx.beginPath();ctx.moveTo(0,-r*0.25);ctx.bezierCurveTo(-r*0.1,-r*0.3,-r*0.16,-r*0.2,0,-r*0.25);ctx.fillStyle='#f0e8c0';ctx.fill();
        ctx.beginPath();ctx.moveTo(0,-r*0.25);ctx.bezierCurveTo(r*0.1,-r*0.3,r*0.16,-r*0.2,0,-r*0.25);ctx.fillStyle='#e8e0b8';ctx.fill();
        ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-3,r*0.05);ctx.strokeStyle='#282828';ctx.lineWidth=2;ctx.stroke();
        ctx.restore();
        // Book pile (stacked on ground, not floating)
        for(let bp=0;bp<5;bp++){ctx.beginPath();ctx.rect(x+r*0.18,y+r*0.1-bp*r*0.045,r*0.24,r*0.042);ctx.fillStyle=['#c03020','#2050c0','#208040','#a06020','#8020a0'][bp];ctx.fill();ctx.strokeStyle='rgba(0,0,0,0.2)';ctx.lineWidth=0.5;ctx.stroke();}
        // Second book pile
        for(let bp=0;bp<3;bp++){ctx.beginPath();ctx.rect(x+r*0.42,y+r*0.14-bp*r*0.045,r*0.16,r*0.042);ctx.fillStyle=['#20a0a0','#c06020','#4020c0'][bp];ctx.fill();ctx.strokeStyle='rgba(0,0,0,0.2)';ctx.lineWidth=0.5;ctx.stroke();}
        // Open book on bench/ground
        ctx.save();ctx.translate(x+r*0.05,y+r*0.15);ctx.rotate(-0.1);ctx.globalAlpha=0.9;
        ctx.beginPath();ctx.rect(-r*0.1,-r*0.065,r*0.2,r*0.075);ctx.fillStyle='#2050c0';ctx.fill();
        ctx.beginPath();ctx.moveTo(-r*0.1,-r*0.065);ctx.quadraticCurveTo(-r*0.15,-r*0.08,-r*0.1,-r*0.065);ctx.lineTo(-r*0.1,r*0.01);ctx.closePath();ctx.fillStyle='#f5f0e0';ctx.fill();
        ctx.beginPath();ctx.moveTo(r*0.1,-r*0.065);ctx.quadraticCurveTo(r*0.15,-r*0.08,r*0.1,-r*0.065);ctx.lineTo(r*0.1,r*0.01);ctx.closePath();ctx.fillStyle='#f0ebe0';ctx.fill();
        for(let ln=0;ln<4;ln++){ctx.beginPath();ctx.moveTo(-r*0.09,(ln-2)*r*0.015);ctx.lineTo(-r*0.01,(ln-2)*r*0.015);ctx.strokeStyle='rgba(80,60,40,0.35)';ctx.lineWidth=0.7;ctx.stroke();}
        for(let ln=0;ln<4;ln++){ctx.beginPath();ctx.moveTo(r*0.01,(ln-2)*r*0.015);ctx.lineTo(r*0.09,(ln-2)*r*0.015);ctx.strokeStyle='rgba(80,60,40,0.35)';ctx.lineWidth=0.7;ctx.stroke();}
        ctx.restore();
        // Magnifying glass (static, leaning)
        ctx.beginPath();ctx.arc(x-r*0.42,y+r*0.12,r*0.06,0,Math.PI*2);ctx.strokeStyle='rgba(180,160,100,0.75)';ctx.lineWidth=3;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x-r*0.375,y+r*0.165);ctx.lineTo(x-r*0.32,y+r*0.21);ctx.strokeStyle='rgba(140,120,70,0.75)';ctx.lineWidth=4;ctx.stroke();
        ctx.beginPath();ctx.arc(x-r*0.42,y+r*0.12,r*0.055,0,Math.PI*2);ctx.fillStyle='rgba(180,220,255,0.12)';ctx.fill();

      } else if(theme==='golden'){
        // PORTFOLIO ISLAND — art gallery district
        // Main gallery facade
        ctx.beginPath();ctx.rect(x-r*0.48,y-r*0.44,r*0.96,r*0.4);
        const galg=ctx.createLinearGradient(x,y-r*0.44,x,y-r*0.04);galg.addColorStop(0,'#eee8f8');galg.addColorStop(1,'#ccc0e0');ctx.fillStyle=galg;ctx.fill();ctx.strokeStyle='#7060a0';ctx.lineWidth=1.5;ctx.stroke();
        // Gallery glass facade windows (large)
        for(let gw=0;gw<4;gw++){
          ctx.beginPath();ctx.rect(x-r*0.44+gw*r*0.24,y-r*0.4,r*0.2,r*0.28);ctx.fillStyle='rgba(180,210,255,0.35)';ctx.fill();ctx.strokeStyle='#9080b0';ctx.lineWidth=1;ctx.stroke();
          // Art visible through window
          ctx.beginPath();ctx.rect(x-r*0.4+gw*r*0.24,y-r*0.36,r*0.12,r*0.18);ctx.fillStyle=['rgba(255,80,40,0.4)','rgba(40,80,255,0.4)','rgba(40,200,80,0.4)','rgba(255,200,0,0.4)'][gw];ctx.fill();
        }
        // Gallery roof
        ctx.beginPath();ctx.rect(x-r*0.5,y-r*0.46,r*1.0,r*0.04);ctx.fillStyle='#8070b0';ctx.fill();
        // Spotlights on roof
        for(let sp=0;sp<4;sp++){
          const spx=x-r*0.36+sp*r*0.24;
          ctx.save();ctx.translate(spx,y-r*0.44);ctx.save();ctx.shadowColor='#ffe060';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.fillStyle='#ffe060';ctx.fill();ctx.restore();
          ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-r*0.08,r*0.44);ctx.lineTo(r*0.08,r*0.44);ctx.closePath();ctx.fillStyle='rgba(255,220,80,0.05)';ctx.fill();ctx.restore();
        }
        // Arched main entrance
        ctx.beginPath();ctx.rect(x-r*0.1,y-r*0.28,r*0.2,r*0.24);ctx.fillStyle='rgba(20,10,40,0.8)';ctx.fill();
        ctx.beginPath();ctx.arc(x,y-r*0.28,r*0.1,Math.PI,0);ctx.fillStyle='rgba(20,10,40,0.8)';ctx.fill();
        ctx.strokeStyle='#b090d0';ctx.lineWidth=2;ctx.stroke();
        // Gallery name
        ctx.save();ctx.fillStyle='#5a4880';ctx.font=`bold ${r*0.08}px Georgia,serif`;ctx.textAlign='center';ctx.fillText('GALLERY',x,y-r*0.14);ctx.restore();
        // Steps
        for(let ls=0;ls<3;ls++){ctx.beginPath();ctx.rect(x-r*(0.22-ls*0.04),y-r*0.04+ls*r*0.03,r*(0.44-ls*0.08),r*0.03);ctx.fillStyle=`rgba(190,175,225,${0.85-ls*0.1})`;ctx.fill();}

        // Sculpture garden (left)
        ctx.beginPath();ctx.ellipse(x-r*0.32,y+r*0.22,r*0.24,r*0.16,0,0,Math.PI*2);ctx.fillStyle='rgba(90,80,120,0.3)';ctx.fill();
        // Sculptures
        [[x-r*0.42,y+r*0.2],[x-r*0.25,y+r*0.14],[x-r*0.18,y+r*0.28]].forEach(([sx,sy])=>{
          ctx.beginPath();ctx.rect(sx-r*0.02,sy-r*0.1,r*0.04,r*0.14);const scg=ctx.createLinearGradient(sx,sy-r*0.1,sx,sy+r*0.04);scg.addColorStop(0,'#e8e8f0');scg.addColorStop(1,'#c8c8d8');ctx.fillStyle=scg;ctx.fill();ctx.strokeStyle='#a0a0b8';ctx.lineWidth=0.8;ctx.stroke();
          ctx.beginPath();ctx.arc(sx,sy-r*0.1,r*0.04,0,Math.PI*2);ctx.fillStyle='#d8d8e8';ctx.fill();ctx.strokeStyle='#a0a0b8';ctx.lineWidth=0.8;ctx.stroke();
        });
        // Courtyard fountain
        ctx.save();ctx.shadowColor='rgba(100,150,255,0.5)';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(x+r*0.25,y+r*0.22,r*0.08,0,Math.PI*2);ctx.fillStyle='rgba(80,140,255,0.4)';ctx.fill();ctx.restore();
        for(let fj=0;fj<5;fj++){const fa=(fj/5)*Math.PI*2+tick*0.02,fh=r*0.05;ctx.beginPath();ctx.moveTo(x+r*0.25,y+r*0.22);ctx.lineTo(x+r*0.25+Math.cos(fa)*fh,y+r*0.22+Math.sin(fa)*fh*0.6);ctx.strokeStyle='rgba(150,200,255,0.55)';ctx.lineWidth=1.5;ctx.stroke();}
        // Artist at easel (right side)
        const artP=tick*0.007;
        ctx.save();ctx.translate(x+r*0.38,y+r*0.08);
        // Easel legs
        ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-r*0.06,r*0.15);ctx.moveTo(0,0);ctx.lineTo(r*0.06,r*0.15);ctx.moveTo(0,-r*0.01);ctx.lineTo(0,r*0.14);ctx.strokeStyle='#8a6020';ctx.lineWidth=1.5;ctx.stroke();
        // Canvas on easel
        ctx.beginPath();ctx.rect(-r*0.08,-r*0.18,r*0.16,r*0.16);ctx.fillStyle='#f8f4e8';ctx.fill();ctx.strokeStyle='#8a6020';ctx.lineWidth=1;ctx.stroke();
        // Painting in progress
        const paintHue=(tick*2)%360;ctx.beginPath();ctx.arc(-r*0.02,-r*0.1,r*0.04,0,Math.PI*2);ctx.fillStyle=`hsla(${paintHue},70%,55%,0.6)`;ctx.fill();
        // Artist silhouette
        ctx.beginPath();ctx.arc(r*0.1,-r*0.05,r*0.04,0,Math.PI*2);ctx.fillStyle='rgba(60,40,20,0.6)';ctx.fill();
        ctx.beginPath();ctx.rect(r*0.06,r*0.0,r*0.08,r*0.1);ctx.fillStyle='rgba(60,40,20,0.6)';ctx.fill();
        ctx.restore();

        // Floating palette + color swatches
        const pp=tick*0.007;const px3=x-r*0.44+Math.sin(pp)*r*0.06,py3=y+r*0.06+Math.cos(pp)*r*0.04;
        ctx.save();ctx.translate(px3,py3);ctx.rotate(pp*0.3);ctx.globalAlpha=0.82;
        ctx.beginPath();ctx.ellipse(0,0,r*0.11,r*0.08,0,0,Math.PI*2);ctx.fillStyle='#b8902a';ctx.fill();ctx.strokeStyle='#8a6018';ctx.lineWidth=1;ctx.stroke();
        ['#ff4040','#4040ff','#40c040','#ffff40','#ff40ff','#40ffff'].forEach((col,pi)=>{const pa=(pi/6)*Math.PI*2;ctx.beginPath();ctx.arc(Math.cos(pa)*r*0.07,Math.sin(pa)*r*0.05,r*0.022,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();});
        ctx.restore();
        // Color splatter on ground
        for(let cs=0;cs<12;cs++){const ca=(cs/12)*Math.PI*2,cr2=r*(0.1+Math.random()*0.15);ctx.beginPath();ctx.arc(x+Math.cos(ca)*cr2,y+r*0.1+Math.sin(ca)*cr2*0.5,r*0.015,0,Math.PI*2);ctx.fillStyle=`hsla(${cs*30},80%,55%,0.25)`;ctx.fill();}

      } else if(theme==='crystal'){
        // RESUME ISLAND — school campus
        // Main school 3-story building
        ctx.beginPath();ctx.rect(x-r*0.46,y-r*0.46,r*0.92,r*0.42);
        const scg2=ctx.createLinearGradient(x,y-r*0.46,x,y-r*0.04);scg2.addColorStop(0,'#e8d8c0');scg2.addColorStop(1,'#c8b898');ctx.fillStyle=scg2;ctx.fill();ctx.strokeStyle='#7a5030';ctx.lineWidth=1.5;ctx.stroke();
        // Brick texture
        for(let br=0;br<6;br++){ctx.beginPath();ctx.moveTo(x-r*0.46,y-r*0.39+br*r*0.065);ctx.lineTo(x+r*0.46,y-r*0.39+br*r*0.065);ctx.strokeStyle='rgba(0,0,0,0.06)';ctx.lineWidth=1;ctx.stroke();}
        // Classroom windows — 3 rows
        for(let wr=0;wr<3;wr++)for(let wc=0;wc<5;wc++){
          const wx2=x-r*0.4+wc*r*0.18,wy2=y-r*0.42+wr*r*0.13;
          const lit=Math.sin(tick*0.02+wr*3+wc*2.1)>-0.4;
          ctx.beginPath();ctx.rect(wx2,wy2,r*0.12,r*0.09);ctx.fillStyle=lit?'rgba(255,240,180,0.88)':'rgba(150,130,100,0.5)';ctx.fill();ctx.strokeStyle='#7a5030';ctx.lineWidth=0.8;ctx.stroke();
          // Window cross
          ctx.beginPath();ctx.moveTo(wx2+r*0.06,wy2);ctx.lineTo(wx2+r*0.06,wy2+r*0.09);ctx.moveTo(wx2,wy2+r*0.045);ctx.lineTo(wx2+r*0.12,wy2+r*0.045);ctx.strokeStyle='rgba(100,70,30,0.3)';ctx.lineWidth=0.5;ctx.stroke();
        }
        // School name
        ctx.save();ctx.fillStyle='#5a3018';ctx.font=`bold ${r*0.08}px Georgia,serif`;ctx.textAlign='center';ctx.fillText('CAL POLY',x,y-r*0.22);ctx.fillStyle='rgba(80,50,20,0.6)';ctx.font=`${r*0.055}px Georgia,serif`;ctx.fillText('SAN LUIS OBISPO',x,y-r*0.14);ctx.restore();

        // Bell tower
        ctx.beginPath();ctx.rect(x-r*0.1,y-r*0.68,r*0.2,r*0.23);ctx.fillStyle='#d8c8a8';ctx.fill();ctx.strokeStyle='#7a5030';ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x-r*0.12,y-r*0.68);ctx.lineTo(x,y-r*0.82);ctx.lineTo(x+r*0.12,y-r*0.68);ctx.closePath();ctx.fillStyle='#8a4020';ctx.fill();
        // Arched window in tower
        ctx.beginPath();ctx.rect(x-r*0.05,y-r*0.62,r*0.1,r*0.08);ctx.fillStyle='rgba(180,210,255,0.5)';ctx.fill();ctx.beginPath();ctx.arc(x,y-r*0.62,r*0.05,Math.PI,0);ctx.fillStyle='rgba(180,210,255,0.5)';ctx.fill();
        // Bell and swing
        const bsw=Math.sin(tick*0.08)*0.2;ctx.save();ctx.translate(x,y-r*0.58);ctx.rotate(bsw);
        ctx.save();ctx.shadowColor='#d4a020';ctx.shadowBlur=5;ctx.beginPath();ctx.arc(0,0,r*0.05,0,Math.PI*2);ctx.fillStyle='#c8a020';ctx.fill();ctx.restore();
        ctx.beginPath();ctx.moveTo(0,r*0.06);ctx.lineTo(0,r*0.09);ctx.strokeStyle='#8a6010';ctx.lineWidth=1;ctx.stroke();ctx.restore();
        // Steps + entrance
        for(let ss=0;ss<3;ss++){ctx.beginPath();ctx.rect(x-r*(0.22-ss*0.04),y-r*0.04+ss*r*0.03,r*(0.44-ss*0.08),r*0.03);ctx.fillStyle=`rgba(180,155,115,${0.85-ss*0.1})`;ctx.fill();}
        ctx.beginPath();ctx.rect(x-r*0.1,y-r*0.18,r*0.2,r*0.14);ctx.fillStyle='rgba(60,40,15,0.75)';ctx.fill();ctx.beginPath();ctx.arc(x,y-r*0.18,r*0.1,Math.PI,0);ctx.fillStyle='rgba(60,40,15,0.75)';ctx.fill();

        // Flagpole with waving flag
        ctx.beginPath();ctx.moveTo(x+r*0.38,y+r*0.0);ctx.lineTo(x+r*0.38,y-r*0.4);ctx.strokeStyle='#c0c0c0';ctx.lineWidth=2.5;ctx.stroke();
        // Flag waves
        ctx.save();ctx.translate(x+r*0.38,y-r*0.4);
        ctx.beginPath();ctx.moveTo(0,0);
        for(let fw=0;fw<=10;fw++){ctx.lineTo(fw*r*0.025,Math.sin(fw*0.8-tick*0.12)*r*0.025);}
        ctx.lineTo(r*0.25,r*0.05);
        for(let fw=10;fw>=0;fw--){ctx.lineTo(fw*r*0.025,r*0.04+Math.sin(fw*0.8-tick*0.12)*r*0.025);}
        ctx.closePath();ctx.fillStyle='#3333cc';ctx.fill();
        // Gold stripe
        ctx.beginPath();ctx.moveTo(0,r*0.02);for(let fw=0;fw<=10;fw++)ctx.lineTo(fw*r*0.025,r*0.02+Math.sin(fw*0.8-tick*0.12)*r*0.025);ctx.lineTo(r*0.25,r*0.025);ctx.strokeStyle='#ffcc00';ctx.lineWidth=3;ctx.stroke();ctx.restore();

        // Running track (oval)
        ctx.beginPath();ctx.ellipse(x-r*0.25,y+r*0.26,r*0.28,r*0.14,0,0,Math.PI*2);ctx.strokeStyle='rgba(200,80,20,0.5)';ctx.lineWidth=3;ctx.stroke();
        ctx.beginPath();ctx.ellipse(x-r*0.25,y+r*0.26,r*0.22,r*0.1,0,0,Math.PI*2);ctx.strokeStyle='rgba(200,80,20,0.35)';ctx.lineWidth=2;ctx.stroke();
        // Football field inside track
        ctx.beginPath();ctx.ellipse(x-r*0.25,y+r*0.26,r*0.18,r*0.09,0,0,Math.PI*2);ctx.fillStyle='rgba(30,140,40,0.45)';ctx.fill();
        ctx.beginPath();ctx.moveTo(x-r*0.43,y+r*0.26);ctx.lineTo(x-r*0.07,y+r*0.26);ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=1;ctx.stroke();

        // Basketball court + hoop
        ctx.beginPath();ctx.rect(x+r*0.14,y+r*0.08,r*0.24,r*0.18);ctx.strokeStyle='rgba(200,150,50,0.5)';ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();ctx.arc(x+r*0.26,y+r*0.08,r*0.06,0,Math.PI*2);ctx.strokeStyle='rgba(200,150,50,0.4)';ctx.lineWidth=1;ctx.stroke();
        // Hoop
        ctx.save();ctx.shadowColor='#ff8020';ctx.shadowBlur=4;ctx.beginPath();ctx.arc(x+r*0.38,y+r*0.1,r*0.025,0,Math.PI*2);ctx.strokeStyle='#ff6010';ctx.lineWidth=2;ctx.stroke();ctx.restore();
        ctx.beginPath();ctx.moveTo(x+r*0.38,y+r*0.06);ctx.lineTo(x+r*0.38,y+r*0.02);ctx.strokeStyle='#888';ctx.lineWidth=1.5;ctx.stroke();

        // Floating graduation caps + diplomas — REMOVED, replaced with static display case
        // Diploma display on wall (static)
        ctx.save();ctx.translate(x+r*0.32,y-r*0.28);ctx.rotate(0);ctx.globalAlpha=0.9;
        ctx.beginPath();ctx.rect(-r*0.13,-r*0.065,r*0.26,r*0.09);ctx.fillStyle='#f8f4e8';ctx.fill();ctx.strokeStyle='#c8a050';ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();ctx.ellipse(-r*0.13,0,r*0.03,r*0.065,0,0,Math.PI*2);ctx.fillStyle='#ede8d8';ctx.fill();
        ctx.beginPath();ctx.ellipse(r*0.13,0,r*0.03,r*0.065,0,0,Math.PI*2);ctx.fillStyle='#ede8d8';ctx.fill();
        ctx.save();ctx.shadowColor='#c03020';ctx.shadowBlur=3;ctx.beginPath();ctx.arc(r*0.04,r*0.01,r*0.025,0,Math.PI*2);ctx.fillStyle='#c03020';ctx.fill();ctx.restore();
        // Ribbon on diploma
        ctx.beginPath();ctx.moveTo(-r*0.04,-r*0.065);ctx.lineTo(r*0.04,-r*0.065);ctx.strokeStyle='#c8a050';ctx.lineWidth=2;ctx.stroke();
        ctx.restore();
        // Graduation cap hanging on wall (static)
        ctx.save();ctx.translate(x-r*0.32,y-r*0.28);ctx.globalAlpha=0.85;
        ctx.beginPath();ctx.rect(-r*0.1,-r*0.012,r*0.2,r*0.012);ctx.fillStyle='#1a1a4a';ctx.fill();
        ctx.beginPath();ctx.rect(-r*0.075,-r*0.052,r*0.15,r*0.042);ctx.fillStyle='#1a1a4a';ctx.fill();
        ctx.beginPath();ctx.moveTo(r*0.075,-r*0.012);ctx.lineTo(r*0.075+r*0.04,r*0.06);ctx.strokeStyle='#c8a020';ctx.lineWidth=1.8;ctx.stroke();
        ctx.beginPath();ctx.arc(r*0.075+r*0.04,r*0.06,3,0,Math.PI*2);ctx.fillStyle='#c8a020';ctx.fill();
        ctx.restore();
        // Pencil on ground
        ctx.save();ctx.translate(x+r*0.1,y+r*0.2);ctx.rotate(-0.4);ctx.globalAlpha=0.85;
        ctx.beginPath();ctx.rect(-2,-r*0.2,4,r*0.2);ctx.fillStyle='#f0d020';ctx.fill();ctx.strokeStyle='#c0a010';ctx.lineWidth=0.8;ctx.stroke();
        ctx.beginPath();ctx.moveTo(-2,-r*0.2);ctx.lineTo(0,-r*0.24);ctx.lineTo(2,-r*0.2);ctx.closePath();ctx.fillStyle='#f0c0a0';ctx.fill();
        ctx.beginPath();ctx.rect(-2,r*0.0,4,r*0.02);ctx.fillStyle='#e080a0';ctx.fill();
        ctx.restore();

      } else if(theme==='sunset'){
        // CONTACT ISLAND — communication hub
        // Main tall telecom tower
        ctx.beginPath();ctx.moveTo(x-r*0.045,y-r*0.04);ctx.lineTo(x-r*0.025,y-r*0.82);ctx.lineTo(x+r*0.025,y-r*0.82);ctx.lineTo(x+r*0.045,y-r*0.04);ctx.closePath();
        const twg=ctx.createLinearGradient(x,y-r*0.82,x,y-r*0.04);twg.addColorStop(0,'#b0b0b8');twg.addColorStop(1,'#808090');ctx.fillStyle=twg;ctx.fill();ctx.strokeStyle='#686870';ctx.lineWidth=1;ctx.stroke();
        // Tower struts
        for(let ts=0;ts<7;ts++){const ty2=y-r*0.08-ts*r*0.105,tw=r*(0.12-ts*0.014);ctx.beginPath();ctx.moveTo(x-tw,ty2);ctx.lineTo(x+tw,ty2);ctx.strokeStyle='rgba(100,100,110,0.55)';ctx.lineWidth=1.5;ctx.stroke();
          // Diagonal struts
          ctx.beginPath();ctx.moveTo(x-tw,ty2);ctx.lineTo(x-(tw-r*0.012),ty2-r*0.105/2);ctx.moveTo(x+tw,ty2);ctx.lineTo(x+(tw-r*0.012),ty2-r*0.105/2);ctx.strokeStyle='rgba(100,100,110,0.25)';ctx.lineWidth=0.8;ctx.stroke();
        }
        // Multiple antennas at top
        for(let an=0;an<5;an++){const ax2=(an-2)*r*0.06;ctx.beginPath();ctx.moveTo(x+ax2,y-r*0.82);ctx.lineTo(x+ax2,y-r*(0.9+Math.abs(an-2)*0.02));ctx.strokeStyle='#909098';ctx.lineWidth=2;ctx.stroke();}
        // Strobe light
        if(Math.sin(tick*0.18)>0.5){ctx.save();ctx.shadowColor='#ff2020';ctx.shadowBlur=14;ctx.beginPath();ctx.arc(x,y-r*0.92,4,0,Math.PI*2);ctx.fillStyle='#ff2020';ctx.fill();ctx.restore();}
        // Signal rings from tower
        for(let sw=0;sw<4;sw++){const swp=((tick*0.018+sw*0.25)%1);const swr=r*(0.08+swp*0.55);ctx.beginPath();ctx.arc(x,y-r*0.55,swr,Math.PI*1.15,Math.PI*1.85);ctx.strokeStyle=`rgba(80,200,255,${0.45*(1-swp)})`;ctx.lineWidth=1.5;ctx.stroke();ctx.beginPath();ctx.arc(x,y-r*0.55,swr,Math.PI*0.15,Math.PI*-0.15+0.15,true);ctx.strokeStyle=`rgba(80,200,255,${0.45*(1-swp)})`;ctx.lineWidth=1.5;ctx.stroke();}

        // Control room building
        ctx.beginPath();ctx.rect(x-r*0.42,y-r*0.32,r*0.34,r*0.28);
        const crg=ctx.createLinearGradient(x-r*0.42,y-r*0.32,x-r*0.08,y-r*0.04);crg.addColorStop(0,'#5a5a70');crg.addColorStop(1,'#3a3a50');ctx.fillStyle=crg;ctx.fill();ctx.strokeStyle='#2a2a40';ctx.lineWidth=1.2;ctx.stroke();
        // Screens visible through windows
        for(let sc=0;sc<3;sc++){
          ctx.beginPath();ctx.rect(x-r*0.38+sc*r*0.1,y-r*0.27,r*0.08,r*0.1);ctx.fillStyle=['rgba(0,200,100,0.5)','rgba(0,150,255,0.5)','rgba(255,100,0,0.4)'][sc];ctx.fill();
          // Scan lines
          for(let sl=0;sl<3;sl++){ctx.beginPath();ctx.moveTo(x-r*0.38+sc*r*0.1,y-r*0.24+sl*r*0.03);ctx.lineTo(x-r*0.3+sc*r*0.1,y-r*0.24+sl*r*0.03);ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=0.8;ctx.stroke();}
        }
        ctx.save();ctx.fillStyle='#80c0ff';ctx.font=`${r*0.04}px monospace`;ctx.textAlign='center';ctx.fillText('CTRL',x-r*0.25,y-r*0.12);ctx.restore();
        // Roof dish
        ctx.save();ctx.translate(x-r*0.28,y-r*0.32);ctx.rotate(0.5);
        ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r*0.1,Math.PI*0.1,Math.PI*0.9);ctx.closePath();ctx.fillStyle='#8888a0';ctx.fill();ctx.strokeStyle='#606080';ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.fillStyle='#505060';ctx.fill();ctx.restore();

        // 3 Phone booths
        for(let ph=0;ph<3;ph++){
          const phx=x+r*(0.08+ph*0.12),phy=y-r*0.06;
          ctx.beginPath();ctx.rect(phx,phy-r*0.28,r*0.09,r*0.28);ctx.fillStyle='#cc2020';ctx.fill();ctx.strokeStyle='#881010';ctx.lineWidth=1.2;ctx.stroke();
          ctx.beginPath();ctx.rect(phx+r*0.01,phy-r*0.22,r*0.07,r*0.14);ctx.fillStyle='rgba(150,220,255,0.65)';ctx.fill();
          ctx.beginPath();ctx.moveTo(phx-r*0.01,phy-r*0.28);ctx.lineTo(phx+r*0.045,phy-r*0.34);ctx.lineTo(phx+r*0.1,phy-r*0.28);ctx.closePath();ctx.fillStyle='#aa1010';ctx.fill();
        }
        // Cluster of 4 mailboxes
        for(let mb=0;mb<4;mb++){
          const mbx=x+r*(0.08+mb*0.08);
          ctx.beginPath();ctx.rect(mbx,y+r*0.1,r*0.07,r*0.1);ctx.fillStyle=['#2244cc','#22aacc','#cc4422','#22cc44'][mb];ctx.fill();ctx.strokeStyle='rgba(0,0,0,0.3)';ctx.lineWidth=0.8;ctx.stroke();
          ctx.beginPath();ctx.ellipse(mbx+r*0.035,y+r*0.1,r*0.035,r*0.025,0,Math.PI,0);ctx.fillStyle=['#3355dd','#33bbdd','#dd5533','#33dd55'][mb];ctx.fill();
        }

        // Large satellite dish (right)
        ctx.save();ctx.translate(x+r*0.36,y-r*0.14);ctx.rotate(-0.8);
        ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r*0.18,Math.PI*0.05,Math.PI*0.95);ctx.closePath();ctx.fillStyle='#c0c0c8';ctx.fill();ctx.strokeStyle='#909098';ctx.lineWidth=1.2;ctx.stroke();
        ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.fillStyle='#707080';ctx.fill();
        ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-r*0.2);ctx.strokeStyle='#808090';ctx.lineWidth=2;ctx.stroke();ctx.restore();
        // Dish mounting post
        ctx.beginPath();ctx.rect(x+r*0.38,y-r*0.14,r*0.04,r*0.18);ctx.fillStyle='#888890';ctx.fill();

        // Phone display shelf (static, grounded)
        ctx.beginPath();ctx.rect(x+r*0.06,y+r*0.08,r*0.36,r*0.04);ctx.fillStyle='#4a4a5a';ctx.fill();ctx.strokeStyle='#2a2a3a';ctx.lineWidth=1;ctx.stroke();
        for(let ph=0;ph<4;ph++){
          const phx=x+r*0.1+ph*r*0.08;
          ctx.beginPath();ctx.rect(phx-r*0.03,y-r*0.08,r*0.055,r*0.16);ctx.fillStyle='#181828';ctx.fill();ctx.strokeStyle='#333348';ctx.lineWidth=0.8;ctx.stroke();
          ctx.beginPath();ctx.rect(phx-r*0.025,y-r*0.075,r*0.045,r*0.11);ctx.fillStyle=`hsl(${ph*90},65%,45%)`;ctx.fill();
          for(let ic=0;ic<4;ic++){ctx.beginPath();ctx.arc(phx-r*0.01+(ic%2)*r*0.02,y-r*0.055+Math.floor(ic/2)*r*0.02,r*0.007,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fill();}
          ctx.beginPath();ctx.arc(phx,y+r*0.04,r*0.007,0,Math.PI*2);ctx.fillStyle='#555';ctx.fill();
        }
      }

      // Labels
      ctx.save();ctx.shadowColor='rgba(0,0,0,0.95)';ctx.shadowBlur=8;
      ctx.fillStyle=t.accent;ctx.font=`bold ${r>100?14:13}px Georgia,serif`;ctx.textAlign='center';ctx.fillText(name,x,y+r*.62+22);
      ctx.fillStyle='rgba(255,240,180,0.7)';ctx.font='11px Georgia,serif';ctx.fillText(`[${lbl}]`,x,y+r*.62+36);ctx.restore();

      ctx.restore();// close entrance animation transform
    }

    function drawShip(){
      const{x,y,ang,spd}=shipRef.current;
      ctx.save();ctx.translate(x,y);ctx.rotate(ang-Math.PI/2);
      ctx.save();ctx.shadowColor='rgba(0,0,0,0.55)';ctx.shadowBlur=18;ctx.shadowOffsetX=6;ctx.shadowOffsetY=8;
      ctx.beginPath();ctx.moveTo(0,-38);ctx.bezierCurveTo(22,-24,24,8,17,30);ctx.lineTo(-17,30);ctx.bezierCurveTo(-24,8,-22,-24,0,-38);ctx.closePath();ctx.fillStyle='#eeeae0';ctx.fill();ctx.restore();
      ctx.beginPath();ctx.moveTo(0,-38);ctx.bezierCurveTo(22,-24,24,8,17,30);ctx.lineTo(-17,30);ctx.bezierCurveTo(-24,8,-22,-24,0,-38);ctx.closePath();ctx.strokeStyle='#1e2d5a';ctx.lineWidth=5.5;ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,-29);ctx.bezierCurveTo(15,-18,17,5,13,24);ctx.lineTo(-13,24);ctx.bezierCurveTo(-17,5,-15,-18,0,-29);ctx.fillStyle='#c07030';ctx.fill();
      for(let i=0;i<5;i++){const p=i/4,py=-24+p*46,w=5+8*Math.sin(p*Math.PI);ctx.beginPath();ctx.moveTo(-w,py);ctx.lineTo(w,py);ctx.strokeStyle='rgba(55,22,4,0.28)';ctx.lineWidth=0.9;ctx.stroke();}
      ctx.beginPath();ctx.arc(0,-5,5,0,Math.PI*2);ctx.fillStyle='#8b6010';ctx.fill();
      const bx=Math.min(spd*1.5,5)+Math.sin(tickRef.current*0.03)*2.5;
      ctx.beginPath();ctx.moveTo(-20,-24);ctx.quadraticCurveTo(-20+bx,-9,-17,9);ctx.lineTo(17,9);ctx.quadraticCurveTo(20+bx,-9,20,-24);ctx.closePath();ctx.fillStyle='rgba(242,228,182,0.97)';ctx.fill();ctx.strokeStyle='#b89050';ctx.lineWidth=1.2;ctx.stroke();
      ctx.fillStyle='rgba(80,28,5,0.7)';ctx.font='bold 9px serif';ctx.textAlign='center';ctx.fillText('KL',bx/2,-7);
      ctx.beginPath();ctx.moveTo(-22,-24);ctx.lineTo(22,-24);ctx.strokeStyle='#7a4010';ctx.lineWidth=2.5;ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,-24);ctx.lineTo(0,-52);ctx.strokeStyle='#7a4010';ctx.lineWidth=2.5;ctx.stroke();
      ctx.beginPath();ctx.moveTo(-22,-24);ctx.lineTo(0,-52);ctx.moveTo(22,-24);ctx.lineTo(0,-52);ctx.strokeStyle='rgba(155,110,50,0.35)';ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,-38);ctx.lineTo(0,-56);ctx.strokeStyle='#8b6010';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,-52);ctx.lineTo(13,-45);ctx.lineTo(0,-38);ctx.closePath();ctx.fillStyle='#111';ctx.fill();
      ctx.save();ctx.translate(0,-38);
      ctx.beginPath();ctx.arc(0,0,7.5,0,Math.PI*2);ctx.fillStyle='#f8f8f4';ctx.fill();ctx.strokeStyle='#bbb';ctx.lineWidth=0.8;ctx.stroke();
      for(let a=0;a<6;a++){const ang2=(a/6)*Math.PI*2;ctx.beginPath();ctx.arc(Math.cos(ang2)*5.2,Math.sin(ang2)*5.2,2.8,0,Math.PI*2);ctx.fillStyle='#f2f0ea';ctx.fill();}
      ctx.beginPath();ctx.arc(-5,-3.5,3.2,Math.PI*0.75,Math.PI*0.1);ctx.strokeStyle='#c8a060';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.arc(5,-3.5,3.2,Math.PI*0.9,Math.PI*0.25,true);ctx.stroke();
      ctx.beginPath();ctx.arc(-2.8,0.8,1.3,0,Math.PI*2);ctx.fillStyle='#333';ctx.fill();ctx.beginPath();ctx.arc(2.8,0.8,1.3,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(-2.2,0.2,0.5,0,Math.PI*2);ctx.fillStyle='white';ctx.fill();ctx.beginPath();ctx.arc(3.4,0.2,0.5,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(0,3,1.2,0,Math.PI*2);ctx.fillStyle='#ff9999';ctx.fill();
      ctx.restore();
      ctx.save();ctx.shadowColor='rgba(255,140,0,.9)';ctx.shadowBlur=14;ctx.beginPath();ctx.arc(0,26,3,0,Math.PI*2);ctx.fillStyle='#ffcc44';ctx.fill();ctx.restore();
      ctx.restore();
    }

    function drawWake(){wakeRef.current.forEach(p=>{const life=1-p.age/p.ma;ctx.beginPath();ctx.arc(p.wx,p.wy,3+(1-life)*18,0,Math.PI*2);ctx.fillStyle=`rgba(140,200,255,${life*0.2})`;ctx.fill();});}

    function drawCompass(H:number){
      const cr=32,cx=54,cy=H-54;
      ctx.save();ctx.globalAlpha=0.88;ctx.beginPath();ctx.arc(cx,cy,cr,0,Math.PI*2);ctx.fillStyle='rgba(8,20,40,0.92)';ctx.fill();ctx.strokeStyle='#c8a870';ctx.lineWidth=1.8;ctx.stroke();
      (['N','E','S','W'] as const).forEach((l,i)=>{const a=i*Math.PI/2;ctx.fillStyle=l==='N'?'#ff5555':'#c8a870';ctx.font='bold 8px Georgia,serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(l,cx+Math.sin(a)*(cr-10),cy-Math.cos(a)*(cr-10));});
      ctx.save();ctx.translate(cx,cy);ctx.rotate(shipRef.current.ang);
      ctx.beginPath();ctx.moveTo(0,-(cr-6));ctx.lineTo(3.5,4);ctx.lineTo(-3.5,4);ctx.closePath();ctx.fillStyle='#ff4444';ctx.fill();
      ctx.beginPath();ctx.moveTo(0,cr-6);ctx.lineTo(3.5,-4);ctx.lineTo(-3.5,-4);ctx.closePath();ctx.fillStyle='#c8a870';ctx.fill();
      ctx.restore();ctx.restore();
    }

    function loop(){
      tickRef.current++;
      const W=canvas.width,H=canvas.height;
      islesRef.current=ISLE_DATA.map(d=>({...d,x:d.pX*W,y:d.pY*H}));
      const s=shipRef.current,k=keysRef.current;
      let ax=0,ay=0;
      if(k['ArrowUp']  ||k['w']||k['W'])ay-=ACCEL;
      if(k['ArrowDown'] ||k['s']||k['S'])ay+=ACCEL;
      if(k['ArrowLeft'] ||k['a']||k['A'])ax-=ACCEL;
      if(k['ArrowRight']||k['d']||k['D'])ax+=ACCEL;
      s.vx=(s.vx+ax)*FRIC;s.vy=(s.vy+ay)*FRIC;
      const spd=Math.hypot(s.vx,s.vy);
      if(spd>MSPD){s.vx=s.vx/spd*MSPD;s.vy=s.vy/spd*MSPD;}
      s.spd=spd;if(spd>0.08)s.ang=Math.atan2(s.vy,s.vx);
      // Island collision — hard ellipse boundary matching green terrain
      islesRef.current.forEach(isle=>{
        const dx=s.x-isle.x,dy=s.y-isle.y;
        const a=isle.r+18,b=isle.r*0.62+12;// terrain size + ship hull clearance
        const nx=dx/a,ny=dy/b;
        const ed=Math.sqrt(nx*nx+ny*ny);
        if(ed<1&&ed>0.0001){
          // Clamp ship position to ellipse surface
          s.x=isle.x+(dx/ed);s.y=isle.y+(dy/ed);
          // Normal to ellipse surface
          const normX=nx/(a),normY=ny/(b);
          const nLen=Math.sqrt(normX*normX+normY*normY);
          const nxN=normX/nLen,nyN=normY/nLen;
          // Cancel any velocity pointing inward
          const dot=s.vx*nxN+s.vy*nyN;
          if(dot<0){s.vx-=dot*nxN;s.vy-=dot*nyN;}
        }
      });
      s.x=Math.max(40,Math.min(W-40,s.x+s.vx));s.y=Math.max(40,Math.min(H-40,s.y+s.vy));
      if(spd>0.25&&tickRef.current%3===0)wakeRef.current.push({wx:s.x-Math.cos(s.ang)*24,wy:s.y-Math.sin(s.ang)*24,age:0,ma:45});
      wakeRef.current=wakeRef.current.map(p=>({...p,age:p.age+1})).filter(p=>p.age<p.ma);
      trailRef.current.push({x:s.x,y:s.y});
      if(trailRef.current.length>TRAIL_LEN)trailRef.current.shift();
      nearRef.current=null;
      islesRef.current.forEach(i=>{if(Math.hypot(s.x-i.x,s.y-i.y)<IDIST)nearRef.current=i;});
      setNear((nearRef.current as Isle|null)?.id||null);

      // Update creatures with steering
      whalesRef.current.forEach(wh=>steer(wh,1.1,islesRef.current,W,H));
      turtlesRef.current.forEach(tu=>steer(tu,0.42,islesRef.current,W,H));
      updateSerpent(W,H);

      drawOcean(W,H);
      drawTrail();
      drawWrecks(W,H);
      islesRef.current.forEach(isle=>drawIsle(isle));
      drawWake();
      whalesRef.current.forEach(wh=>drawWhale(wh,tickRef.current));
      turtlesRef.current.forEach(tu=>drawTurtle(tu,tickRef.current));
      drawSerpent();
      drawBirds(W,H);
      drawShip();
      drawCompass(H);
      animRef.current=requestAnimationFrame(loop);
    }
    animRef.current=requestAnimationFrame(loop);

    return()=>{
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize',resize);window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);
      canvas.removeEventListener('click',onClick);canvas.removeEventListener('mousemove',onMove);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[screen]);

  if(screen==='loading'){return(
    <div style={{position:'relative',width:'100%',height:'100vh',background:'#030912',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Georgia,serif',color:'#f5e6c0',overflow:'hidden'}}>
      <style>{`
        @keyframes pulse{0%{opacity:0.15;transform:scale(1)}100%{opacity:0.7;transform:scale(1.8)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes waveScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes starFloat{0%{opacity:0;transform:translateY(0)}10%{opacity:1}90%{opacity:1}100%{opacity:0;transform:translateY(-80px)}}
        @keyframes compassSpin{0%{transform:rotate(0deg)}30%{transform:rotate(120deg)}60%{transform:rotate(240deg)}100%{transform:rotate(360deg)}}
        @keyframes shimmer{0%,100%{opacity:0.5}50%{opacity:1}}
        @keyframes barShine{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes boatRock{0%,100%{transform:rotate(-4deg) translateY(0)}50%{transform:rotate(4deg) translateY(-6px)}}
        @keyframes waveRise{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.4)}}
        @keyframes ringPulse{0%{transform:scale(0.8);opacity:0.8}100%{transform:scale(2.2);opacity:0}}
      `}</style>

      {/* Animated ocean waves background */}
      <div style={{position:'absolute',inset:0,overflow:'hidden'}}>
        {/* Deep gradient */}
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 60%,#0a2040 0%,#030912 70%)'}}/>
        {/* Scrolling wave lines */}
        <div style={{position:'absolute',bottom:0,left:0,width:'200%',height:'100%',animation:'waveScroll 8s linear infinite',opacity:0.12}}>
          {Array.from({length:14}).map((_,i)=>(
            <div key={i} style={{position:'absolute',left:0,right:0,height:2,top:`${20+i*6}%`,background:`rgba(80,${160+i*6},240,0.8)`,borderRadius:2,transform:`scaleX(${0.8+Math.sin(i)*0.2})`}}/>
          ))}
        </div>
        {/* Rising star/foam particles */}
        {Array.from({length:20}).map((_,i)=>(
          <div key={i} style={{position:'absolute',width:i%3===0?4:2,height:i%3===0?4:2,borderRadius:'50%',background:`rgba(${180+i*3},${160+i*4},${100+i*2},0.6)`,bottom:`${5+i*4}%`,left:`${3+i*5}%`,animation:`starFloat ${3+i*0.4}s ease-out ${i*0.3}s infinite`}}/>
        ))}
      </div>

      {/* Animated boat */}
      <div style={{position:'absolute',bottom:'28%',left:'50%',transform:'translateX(-50%)',animation:'boatRock 3s ease-in-out infinite',zIndex:3}}>
        <svg width="90" height="70" viewBox="0 0 90 70" fill="none">
          {/* Hull */}
          <path d="M10 40 Q45 55 80 40 L72 50 Q45 62 18 50 Z" fill="#c07030" stroke="#8a4010" strokeWidth="1.5"/>
          <path d="M10 40 L80 40" stroke="#1e2d5a" strokeWidth="3"/>
          {/* Mast */}
          <line x1="45" y1="40" x2="45" y2="5" stroke="#7a4010" strokeWidth="3"/>
          {/* Sail */}
          <path d="M45 8 Q62 18 62 36 L45 36 Z" fill="rgba(242,228,182,0.95)" stroke="#b89050" strokeWidth="1"/>
          {/* Flag */}
          <path d="M45 5 L55 9 L45 13 Z" fill="#c03020"/>
          {/* Wake waves */}
          <path d="M5 52 Q20 48 35 52 Q50 56 65 52 Q80 48 88 52" stroke="rgba(140,200,255,0.5)" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>

      {/* Animated compass ring */}
      <div style={{position:'absolute',top:'12%',right:'12%',zIndex:3}}>
        <div style={{position:'relative',width:80,height:80}}>
          {/* Outer ring pulses */}
          <div style={{position:'absolute',inset:-10,borderRadius:'50%',border:'1.5px solid rgba(200,168,80,0.3)',animation:'ringPulse 2s ease-out infinite'}}/>
          <div style={{position:'absolute',inset:-10,borderRadius:'50%',border:'1.5px solid rgba(200,168,80,0.3)',animation:'ringPulse 2s ease-out 0.7s infinite'}}/>
          {/* Compass body */}
          <div style={{position:'absolute',inset:0,borderRadius:'50%',background:'rgba(8,20,40,0.95)',border:'2px solid #c8a870',display:'flex',alignItems:'center',justifyContent:'center'}}>
            {/* Needle */}
            <div style={{position:'absolute',width:4,height:32,top:8,left:'calc(50% - 2px)',animation:'compassSpin 4s cubic-bezier(0.4,0,0.6,1) infinite',transformOrigin:'50% 75%',borderRadius:2,background:'linear-gradient(to bottom,#ff4444 50%,#c8a870 50%)'}}/>
            {/* N label */}
            <div style={{position:'absolute',top:4,fontSize:9,fontWeight:'bold',color:'#ff5555',letterSpacing:1}}>N</div>
          </div>
        </div>
      </div>

      {/* Islands silhouettes left */}
      <div style={{position:'absolute',left:'6%',bottom:'22%',opacity:0.18,zIndex:2}}>
        <svg width="70" height="50" viewBox="0 0 70 50"><ellipse cx="35" cy="38" rx="32" ry="14" fill="#2a8a30"/><path d="M35 38 Q28 20 35 5 Q42 20 35 38Z" fill="#3a2a1a"/></svg>
      </div>
      <div style={{position:'absolute',right:'8%',bottom:'18%',opacity:0.14,zIndex:2}}>
        <svg width="50" height="38" viewBox="0 0 50 38"><ellipse cx="25" cy="28" rx="22" ry="12" fill="#4a7a9a"/><path d="M20 28 L25 8 L30 28Z" fill="#7090b0"/></svg>
      </div>

      {/* Main content */}
      <div style={{position:'relative',textAlign:'center',zIndex:4}}>
        {/* Title with shimmer */}
        <div style={{fontSize:'2.6rem',fontWeight:'bold',letterSpacing:4,marginBottom:6,background:'linear-gradient(90deg,#c8a060,#ffd060,#c8a060)',backgroundSize:'200%',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',animation:'barShine 2.5s linear infinite',filter:'drop-shadow(0 0 20px rgba(200,160,60,0.4))'}}>
          KYLE LIN
        </div>
        <div style={{fontSize:11,letterSpacing:8,color:'rgba(200,168,112,0.5)',textTransform:'uppercase',marginBottom:32}}>Portfolio</div>

        {/* Loading status */}
        <div style={{marginBottom:10,fontSize:'0.85rem',letterSpacing:4,color:'#c8a870',textTransform:'uppercase',animation:'shimmer 1.5s ease-in-out infinite'}}>
          {loadText}<span style={{animation:'blink 0.8s infinite'}}> ···</span>
        </div>

        {/* Progress bar — nautical chart style */}
        <div style={{position:'relative',width:320,margin:'0 auto 10px'}}>
          {/* Tick marks */}
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            {Array.from({length:11}).map((_,i)=>(
              <div key={i} style={{width:1,height:i%5===0?8:4,background:`rgba(200,160,80,${progress/100>i/10?0.6:0.2})`,transition:'all 0.3s'}}/>
            ))}
          </div>
          {/* Main bar */}
          <div style={{height:4,background:'rgba(200,160,80,0.12)',borderRadius:2,overflow:'hidden',border:'1px solid rgba(200,160,80,0.15)'}}>
            <div style={{height:'100%',width:`${progress}%`,background:'linear-gradient(90deg,#6a3808,#c8a020,#ffd060)',borderRadius:2,transition:'width 0.12s ease',boxShadow:'0 0 12px rgba(255,200,60,0.6)',backgroundSize:'200%',animation:'barShine 1.5s linear infinite'}}/>
          </div>
          {/* Percentage */}
          <div style={{marginTop:8,fontSize:'1.8rem',fontWeight:'bold',color:'#f5e6c0',letterSpacing:2,textShadow:'0 0 20px rgba(200,160,80,0.5)'}}>
            {Math.round(progress)}<span style={{fontSize:'0.9rem',color:'rgba(200,168,112,0.5)',marginLeft:2}}>%</span>
          </div>
        </div>

        <div style={{fontSize:9,color:'rgba(200,160,80,0.25)',letterSpacing:4,textTransform:'uppercase',marginTop:4}}>Preparing your voyage</div>
      </div>
    </div>
  );}

  if(screen==='splash'){return(
    <div style={{position:'relative',width:'100%',height:'100vh',background:'#030912',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Georgia,serif',color:'#f5e6c0',overflow:'hidden',cursor:'default'}}>
      {/* Map lines */}
      <div style={{position:'absolute',inset:0,opacity:0.13,background:'repeating-linear-gradient(0deg,transparent,transparent 48px,rgba(80,150,240,0.5) 48px,rgba(80,150,240,0.5) 50px)',pointerEvents:'none'}}/>
      <style>{`
        @keyframes glow{0%,100%{text-shadow:0 0 30px rgba(200,160,80,.3),0 0 60px rgba(200,160,80,.1)}50%{text-shadow:0 0 60px rgba(200,160,80,.8),0 0 100px rgba(200,160,80,.3)}}
        @keyframes btnGlow{0%,100%{box-shadow:0 0 12px rgba(200,160,70,.2)}50%{box-shadow:0 0 32px rgba(200,160,70,.5)}}
        @keyframes staggerIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes anchorBob{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-12px) scale(1.05)}}
      `}</style>

      {/* Content */}
      <div style={{position:'relative',zIndex:5,textAlign:'center'}}>
        {/* Anchor */}
        <div style={{fontSize:64,marginBottom:20,animation:'anchorBob 3.5s ease-in-out infinite',display:'inline-block',filter:'drop-shadow(0 0 24px rgba(200,160,80,.6))'}}>
          ⚓
        </div>

        {/* Name */}
        <div style={{animation:'staggerIn 0.7s ease forwards',opacity:0}}>
          <h1 style={{fontSize:'3.2rem',fontWeight:'bold',margin:'0 0 4px',letterSpacing:4,animation:'glow 3s ease-in-out infinite',color:'#f5e6c0'}}>
            Hey, I'm Kyle Lin
          </h1>
        </div>

        {/* Divider */}
        <div style={{animation:'staggerIn 0.7s 0.2s ease forwards',opacity:0,marginBottom:36,marginTop:12}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12}}>
            <div style={{width:60,height:1,background:'linear-gradient(to right,transparent,rgba(200,160,80,0.4))'}}/>
            <div style={{fontSize:14,color:'rgba(200,160,80,0.5)'}}>✦</div>
            <div style={{width:60,height:1,background:'linear-gradient(to left,transparent,rgba(200,160,80,0.4))'}}/>
          </div>
        </div>

        <div style={{animation:'staggerIn 0.7s 0.35s ease forwards',opacity:0}}>
          <p style={{fontSize:13,color:'rgba(200,168,112,0.85)',marginBottom:44,letterSpacing:2,textShadow:'0 0 12px rgba(200,160,80,0.5)'}}>Sail the seas to learn more about me</p>
        </div>

        {/* Explore button */}
        <div style={{animation:'staggerIn 0.7s 0.5s ease forwards',opacity:0}}>
          <button
            onClick={()=>setScreen('game')}
            style={{background:'transparent',border:'2px solid #c8a870',borderRadius:2,color:'#f5e6c0',fontFamily:'Georgia,serif',fontSize:'1rem',letterSpacing:6,padding:'16px 60px',cursor:'pointer',textTransform:'uppercase',transition:'all 0.25s ease',animation:'btnGlow 3s ease-in-out infinite'}}
            onMouseEnter={e=>{const b=e.currentTarget;b.style.background='rgba(200,160,70,.15)';b.style.boxShadow='0 0 40px rgba(200,160,70,.4)';b.style.letterSpacing='8px';}}
            onMouseLeave={e=>{const b=e.currentTarget;b.style.background='transparent';b.style.boxShadow='';b.style.letterSpacing='6px';}}
          >
            Explore
          </button>
        </div>

        <div style={{animation:'staggerIn 0.7s 0.65s ease forwards',opacity:0,marginTop:22}}>
          <p style={{fontSize:10,color:'rgba(200,160,80,0.6)',letterSpacing:3,textTransform:'uppercase',textShadow:'0 0 10px rgba(200,160,80,0.4)'}}>WASD or arrow keys to sail · Click islands to visit</p>
        </div>
      </div>
    </div>
  );}

  return(
    <div style={{position:'relative',width:'100%',height:'100vh',overflow:'hidden',background:'#0b1d35',fontFamily:'Georgia,serif'}}>
      <canvas ref={cvsRef} style={{display:'block',width:'100%',height:'100%'}}/>
      <div style={{position:'absolute',top:14,left:16,color:'#f5e6c0',pointerEvents:'none',zIndex:5}}>
        <div style={{fontSize:15,fontWeight:'bold',textShadow:'0 0 10px rgba(200,168,80,.5)'}}>Hey, I'm Kyle Lin</div>
        <div style={{fontSize:10,color:'rgba(200,168,112,.5)',marginTop:3}}>WASD / ↑↓←→ to sail · E or click an island to visit</div>
      </div>
      {/* Tutorial overlay */}
      {showTutorial&&(
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:20,background:'rgba(3,9,18,0.6)',backdropFilter:'blur(3px)'}}>
          <div style={{background:'rgba(8,18,40,0.97)',border:'1px solid rgba(200,168,80,0.4)',borderRadius:16,padding:'40px 52px',textAlign:'center',fontFamily:'Georgia,serif',color:'#f5e6c0',maxWidth:420,boxShadow:'0 0 60px rgba(0,0,0,0.8)'}}>
            <div style={{fontSize:36,marginBottom:16}}>⚓</div>
            <h2 style={{fontSize:'1.3rem',fontWeight:'bold',letterSpacing:3,margin:'0 0 8px',color:'#f5e6c0'}}>Welcome Aboard</h2>
            <p style={{fontSize:12,color:'rgba(200,168,112,0.6)',letterSpacing:2,textTransform:'uppercase',marginBottom:28}}>Captain's Briefing</p>

            {/* Controls grid */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px 24px',marginBottom:28,textAlign:'left'}}>
              {[
                {keys:'W A S D',desc:'Sail the ship'},
                {keys:'↑ ↓ ← →',desc:'Arrow keys work too'},
                {keys:'E',desc:'Visit nearby island'},
                {keys:'Click',desc:'Click island to visit'},
              ].map(({keys,desc})=>(
                <div key={keys} style={{display:'flex',alignItems:'center',gap:10}}>
                  <kbd style={{background:'rgba(200,160,50,.15)',border:'1px solid rgba(200,160,80,0.4)',borderRadius:5,padding:'3px 9px',fontSize:11,fontFamily:'Georgia,serif',color:'#c8a870',whiteSpace:'nowrap'}}>{keys}</kbd>
                  <span style={{fontSize:12,color:'rgba(200,168,112,0.7)'}}>{desc}</span>
                </div>
              ))}
            </div>

            <div style={{height:1,background:'rgba(200,160,80,0.15)',marginBottom:24}}/>
            <p style={{fontSize:12,color:'rgba(200,168,112,0.55)',marginBottom:24,letterSpacing:1}}>Sail to each island to explore a section of my portfolio. The ship is you!</p>

            <button
              onClick={()=>setShowTutorial(false)}
              style={{background:'transparent',border:'2px solid #c8a870',borderRadius:4,color:'#f5e6c0',fontFamily:'Georgia,serif',fontSize:'0.9rem',letterSpacing:5,padding:'12px 40px',cursor:'pointer',textTransform:'uppercase',transition:'all 0.2s ease'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(200,160,70,.15)';e.currentTarget.style.boxShadow='0 0 24px rgba(200,160,70,.3)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.boxShadow='none';}}
            >
              Set Sail
            </button>
          </div>
        </div>
      )}
      {near&&(<div style={{position:'absolute',bottom:24,left:'50%',transform:'translateX(-50%)',background:'rgba(8,18,35,.93)',border:`1px solid ${THEMES[ISLE_DATA.find(i=>i.id===near)!.theme].accent}`,borderRadius:9,padding:'10px 26px',color:'#f5e6c0',fontSize:13,whiteSpace:'nowrap',pointerEvents:'none',zIndex:5}}>
        Press{' '}<kbd style={{background:'rgba(200,160,50,.2)',border:'1px solid #c8a870',borderRadius:3,padding:'1px 7px',fontWeight:'bold',fontFamily:'Georgia,serif'}}>E</kbd>{' '}or click to visit {ISLE_DATA.find(i=>i.id===near)?.name}
      </div>)}
      <div style={{position:'absolute',bottom:18,right:18,display:'grid',gridTemplateColumns:'38px 38px 38px',gridTemplateRows:'38px 38px 38px',gap:4,zIndex:5}}>
        {(['','dU','','dL','dD','dR'] as const).map((id,i)=>{
          if(!id)return <div key={i}/>;
          const label=id==='dU'?'↑':id==='dD'?'↓':id==='dL'?'←':'→';
          const key=id==='dU'?'ArrowUp':id==='dD'?'ArrowDown':id==='dL'?'ArrowLeft':'ArrowRight';
          return(<div key={id} onPointerDown={e=>{e.preventDefault();keysRef.current[key]=true;}} onPointerUp={()=>keysRef.current[key]=false} onPointerLeave={()=>keysRef.current[key]=false} style={{background:'rgba(200,160,70,.15)',border:'1px solid rgba(200,160,70,.4)',borderRadius:6,color:'#c8a870',fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',userSelect:'none',touchAction:'none'}}>{label}</div>);
        })}
      </div>
    </div>
  );
}
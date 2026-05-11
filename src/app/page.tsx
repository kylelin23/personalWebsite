"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";


const ISLE_DATA = [
  { id:'home',      name:'Home Island',      lbl:'Home',      pX:.50, pY:.50, r:90, theme:'emerald' },
  { id:'contact',   name:'Contact Island',   lbl:'Contact',   pX:.50, pY:.13, r:82, theme:'sunset'  },
  { id:'blog',      name:'Blog Island',      lbl:'Blog',      pX:.86, pY:.30, r:78, theme:'storm'   },
  { id:'portfolio', name:'Portfolio Island', lbl:'Portfolio', pX:.86, pY:.76, r:92, theme:'golden'  },
  { id:'resume',    name:'Resume Island',    lbl:'Resume',    pX:.14, pY:.76, r:73, theme:'crystal' },
];

const ROUTES: Record<string,string> = {
  home:'/', blog:'/blog/', portfolio:'/portfolio/', resume:'/resume/', contact:'/contact/'
};

const THEMES: Record<string,{sand:string;top:string;accent:string}> = {
  emerald:{sand:'#c8a84a',top:'#2a8a30',accent:'#80ff90'},
  storm:  {sand:'#5a6a7a',top:'#2a3a4a',accent:'#80c0ff'},
  golden: {sand:'#d4a820',top:'#a06010',accent:'#ffd060'},
  crystal:{sand:'#7a9aaa',top:'#4a7a9a',accent:'#a0e8ff'},
  sunset: {sand:'#c86030',top:'#8a3010',accent:'#ffaa60'},
};

const FOAM=Array.from({length:60},(_,i)=>({pX:((i*37*127+113)%9973)/9973,pY:((i*53*89+227)%9871)/9871,ph:i*2.17,sz:1.5+(i%3)*0.7}));
const ACCEL=0.2,FRIC=0.87,MSPD=4.0,IDIST=165;
type Isle=typeof ISLE_DATA[0]&{x:number;y:number};

export default function Home(){
  const router=useRouter();
  const cvsRef=useRef<HTMLCanvasElement>(null);
  const shipRef=useRef({x:0,y:0,vx:0,vy:0,ang:0,spd:0,ready:false});
  const keysRef=useRef<Record<string,boolean>>({});
  const wakeRef=useRef<{wx:number;wy:number;age:number;ma:number}[]>([]);
  const tickRef=useRef(0);
  const animRef=useRef(0);
  const islesRef=useRef<Isle[]>([]);
  const nearRef=useRef<Isle|null>(null);
  const [near,setNear]=useState<string|null>(null);
  const searchParams = useSearchParams();
  const [screen, setScreen] = useState<'loading'|'splash'|'game'>(
    searchParams.get('screen') === 'game' ? 'game' : 'loading'
  );
  const [progress,setProgress]=useState(0);
  const [loadText,setLoadText]=useState('Creating Map');

  // Loading screen
  useEffect(()=>{
  if(screen==='game') return;
  const texts=['Creating Map','Charting Islands','Raising Sails','Stocking Provisions','Setting Course'];
  let p=0,ti=0;
  const interval=setInterval(()=>{
    p+=Math.random()*12+4;
    if(p>=100){p=100;clearInterval(interval);setTimeout(()=>setScreen('splash'),400);}
    setProgress(Math.min(p,100));
    if(Math.floor(p/20)!==ti){ti=Math.floor(p/20);setLoadText(texts[Math.min(ti,texts.length-1)]);}
  },120);
  return()=>clearInterval(interval);
},[]);

  // Game init
  useEffect(()=>{
    if(screen!=='game')return;
    const canvas=cvsRef.current!;
    const ctx=canvas.getContext('2d')!;

    function resize(){
      canvas.width=window.innerWidth;
      canvas.height=window.innerHeight;
      if(!shipRef.current.ready){
        shipRef.current.x=canvas.width*0.5;
        shipRef.current.y=canvas.height*0.65;
        shipRef.current.ready=true;
      }
    }
    resize();
    window.addEventListener('resize',resize);

    // ── KEY HANDLERS ──
    const kd=(e:KeyboardEvent)=>{
      if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault();
      keysRef.current[e.key]=true;
      if((e.key==='e'||e.key==='E')&&nearRef.current){
        if(nearRef.current.id==='home')setScreen('splash');
        else router.push(ROUTES[nearRef.current.id]);
      }
    };
    const ku=(e:KeyboardEvent)=>{keysRef.current[e.key]=false;};
    window.addEventListener('keydown',kd); // ← this was missing
    window.addEventListener('keyup',ku);

    function onCanvasClick(e:MouseEvent){
      const rect=canvas.getBoundingClientRect();
      const cx=e.clientX-rect.left,cy=e.clientY-rect.top;
      for(const isle of islesRef.current){
        if(Math.hypot(cx-isle.x,cy-isle.y)<isle.r*0.85){
          if(isle.id==='home')setScreen('splash');
          else router.push(ROUTES[isle.id]);
          return;
        }
      }
    }
    function onMouseMove(e:MouseEvent){
      const rect=canvas.getBoundingClientRect();
      const mx=e.clientX-rect.left,my=e.clientY-rect.top;
      canvas.style.cursor=islesRef.current.some(i=>Math.hypot(mx-i.x,my-i.y)<i.r*0.85)?'pointer':'default';
    }
    canvas.addEventListener('click',onCanvasClick);
    canvas.addEventListener('mousemove',onMouseMove);

    // ── DRAW OCEAN ──
    function drawOcean(W:number,H:number){
      ctx.fillStyle='#0b1d35';ctx.fillRect(0,0,W,H);
      const rh=52,nr=Math.ceil(H/rh)+2;
      for(let r=-1;r<nr;r++){
        const sy=r*rh,ph=tickRef.current*0.008+r*0.9;
        ctx.beginPath();
        for(let x=-20;x<W+20;x+=5){const y=sy+9*Math.sin(x*0.014+ph)+4*Math.sin(x*0.023-ph*1.2);x===-20?ctx.moveTo(x,y):ctx.lineTo(x,y);}
        ctx.strokeStyle=`rgba(90,170,240,${Math.max(0,0.038+0.025*Math.sin(r*2.3+tickRef.current*0.009))})`;ctx.lineWidth=1.5;ctx.stroke();
      }
      FOAM.forEach(f=>{
        const sx=f.pX*W,sy=f.pY*H,a=Math.max(0,Math.sin(tickRef.current*0.04+f.ph))*0.28;
        if(a<0.03)return;
        ctx.beginPath();ctx.arc(sx,sy,f.sz,0,Math.PI*2);ctx.fillStyle=`rgba(190,225,255,${a})`;ctx.fill();
      });
    }

    // ── DRAW ISLAND ──
    function drawIsle(isle:Isle){
      const{x,y,r,name,lbl,theme}=isle;
      const t=THEMES[theme];
      const tick=tickRef.current;
      ctx.beginPath();ctx.ellipse(x,y,r+24,r*0.65+16,0,0,Math.PI*2);ctx.fillStyle='rgba(80,150,200,0.1)';ctx.fill();
      ctx.save();ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=24;ctx.shadowOffsetX=6;ctx.shadowOffsetY=9;
      ctx.beginPath();ctx.ellipse(x,y,r,r*0.62,0,0,Math.PI*2);ctx.fillStyle=t.sand;ctx.fill();ctx.restore();
      ctx.beginPath();ctx.ellipse(x,y-r*0.05,r*0.7,r*0.44,0,0,Math.PI*2);ctx.fillStyle=t.top;ctx.fill();

      if(theme==='emerald'){
        ctx.beginPath();ctx.moveTo(x,y-r*0.62);ctx.lineTo(x-r*0.32,y-r*0.08);ctx.lineTo(x+r*0.32,y-r*0.08);ctx.closePath();
        const vg=ctx.createLinearGradient(x,y-r*0.62,x,y-r*0.08);vg.addColorStop(0,'#4a1a0a');vg.addColorStop(1,'#2a6a10');ctx.fillStyle=vg;ctx.fill();
        ctx.save();ctx.shadowColor='#ff4400';ctx.shadowBlur=18;ctx.beginPath();ctx.arc(x,y-r*0.58,r*0.1,0,Math.PI*2);ctx.fillStyle='#ff6622';ctx.fill();ctx.restore();
        for(let i=0;i<3;i++){const sy2=y-r*0.62-(i*14)-(Math.sin(tick*0.04+i)*4);ctx.beginPath();ctx.arc(x+(Math.sin(tick*0.02+i)*6),sy2,6+i*4,0,Math.PI*2);ctx.fillStyle=`rgba(180,180,180,${0.3-i*0.08})`;ctx.fill();}
        for(let p=0;p<4;p++){
          const ang2=(p/4)*Math.PI*2+0.4,px2=x+Math.cos(ang2)*r*0.4,py2=y+Math.sin(ang2)*r*0.2;
          ctx.beginPath();ctx.moveTo(px2,py2);ctx.lineTo(px2+2,py2-22);ctx.strokeStyle='#5a3010';ctx.lineWidth=2.5;ctx.stroke();
          for(let l=0;l<5;l++){const la=(l/5)*Math.PI*2+tick*0.01;ctx.beginPath();ctx.moveTo(px2+2,py2-22);ctx.quadraticCurveTo(px2+Math.cos(la)*14,py2-22+Math.sin(la)*8,px2+Math.cos(la)*18,py2-22+Math.sin(la)*14);ctx.strokeStyle='#2a8a10';ctx.lineWidth=2;ctx.stroke();}
        }
        ctx.beginPath();ctx.moveTo(x+r*0.18,y-r*0.28);ctx.lineTo(x+r*0.22,y+r*0.05);
        const wg=ctx.createLinearGradient(x+r*0.18,y-r*0.28,x+r*0.22,y+r*0.05);wg.addColorStop(0,'rgba(100,200,255,0.7)');wg.addColorStop(1,'rgba(100,200,255,0.1)');ctx.strokeStyle=wg;ctx.lineWidth=3;ctx.stroke();

      } else if(theme==='storm'){
        ctx.beginPath();ctx.moveTo(x,y-r*0.68);ctx.lineTo(x-r*0.1,y-r*0.5);ctx.lineTo(x-r*0.22,y-r*0.55);ctx.lineTo(x-r*0.35,y-r*0.1);ctx.lineTo(x+r*0.35,y-r*0.1);ctx.lineTo(x+r*0.2,y-r*0.52);ctx.lineTo(x+r*0.1,y-r*0.45);ctx.closePath();
        const mg=ctx.createLinearGradient(x,y-r*0.68,x,y-r*0.1);mg.addColorStop(0,'#eeeeff');mg.addColorStop(0.3,'#8899aa');mg.addColorStop(1,'#445566');ctx.fillStyle=mg;ctx.fill();
        for(let i=0;i<4;i++){const cx2=x+(i-1.5)*r*0.28,cy2=y-r*0.52+(Math.sin(tick*0.015+i)*4);ctx.beginPath();ctx.arc(cx2,cy2,r*0.13,0,Math.PI*2);ctx.fillStyle=`rgba(40,50,70,${0.75+i*0.05})`;ctx.fill();}
        if(Math.sin(tick*0.08)>0.92){ctx.beginPath();ctx.moveTo(x+r*0.05,y-r*0.58);ctx.lineTo(x-r*0.05,y-r*0.38);ctx.lineTo(x+r*0.06,y-r*0.38);ctx.lineTo(x-r*0.04,y-r*0.18);ctx.save();ctx.shadowColor='#ffffaa';ctx.shadowBlur=20;ctx.strokeStyle='#ffffaa';ctx.lineWidth=2.5;ctx.stroke();ctx.restore();}
        for(let i=0;i<12;i++){const rx=x+(i-6)*r*0.09,ry=y-r*0.3+((tick*3+i*7)%(r*0.8))-r*0.1;ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-1,ry+6);ctx.strokeStyle='rgba(150,200,255,0.35)';ctx.lineWidth=1;ctx.stroke();}

      } else if(theme==='golden'){
        ctx.beginPath();ctx.rect(x-r*0.38,y-r*0.15,r*0.76,r*0.22);const tg=ctx.createLinearGradient(x,y-r*0.15,x,y+r*0.07);tg.addColorStop(0,'#d4a820');tg.addColorStop(1,'#a06010');ctx.fillStyle=tg;ctx.fill();ctx.strokeStyle='#8a5010';ctx.lineWidth=1.5;ctx.stroke();
        for(let i=0;i<5;i++){const px2=x-r*0.32+i*r*0.16;ctx.beginPath();ctx.rect(px2-3,y-r*0.42,6,r*0.28);ctx.fillStyle='#c89820';ctx.fill();ctx.strokeStyle='#8a5010';ctx.lineWidth=1;ctx.stroke();}
        ctx.beginPath();ctx.moveTo(x-r*0.42,y-r*0.42);ctx.lineTo(x,y-r*0.62);ctx.lineTo(x+r*0.42,y-r*0.42);ctx.closePath();ctx.fillStyle='#ddb830';ctx.fill();ctx.strokeStyle='#8a5010';ctx.lineWidth=1.5;ctx.stroke();
        for(let i=0;i<6;i++){const ang2=(i/6)*Math.PI*2+tick*0.05,sparkX=x+Math.cos(ang2)*r*0.55,sparkY=y+Math.sin(ang2)*r*0.3;if(Math.sin(tick*0.1+i)>0.5){ctx.beginPath();ctx.arc(sparkX,sparkY,2,0,Math.PI*2);ctx.fillStyle='#ffe060';ctx.save();ctx.shadowColor='#ffd020';ctx.shadowBlur=8;ctx.fill();ctx.restore();}}
        for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x-r*0.38+i*r*0.15,y-r*0.4);ctx.quadraticCurveTo(x-r*0.42+i*r*0.15+Math.sin(tick*0.02+i)*4,y-r*0.2,x-r*0.38+i*r*0.14,y-r*0.05);ctx.strokeStyle='rgba(30,140,20,0.6)';ctx.lineWidth=2;ctx.stroke();}

      } else if(theme==='crystal'){
        const crystals=[{ox:-r*0.3,h:r*0.52,w:10},{ox:-r*0.12,h:r*0.65,w:13},{ox:0,h:r*0.58,w:11},{ox:r*0.15,h:r*0.48,w:9},{ox:r*0.3,h:r*0.42,w:8}];
        crystals.forEach(({ox,h,w})=>{ctx.save();ctx.shadowColor='#60e8ff';ctx.shadowBlur=16;ctx.beginPath();ctx.moveTo(x+ox,y-h);ctx.lineTo(x+ox-w,y-r*0.08);ctx.lineTo(x+ox+w,y-r*0.08);ctx.closePath();const cg=ctx.createLinearGradient(x+ox,y-h,x+ox,y-r*0.08);cg.addColorStop(0,'#e0f8ff');cg.addColorStop(0.4,'#60c8e8');cg.addColorStop(1,'#2a7a9a');ctx.fillStyle=cg;ctx.fill();ctx.strokeStyle='rgba(160,240,255,0.6)';ctx.lineWidth=1;ctx.stroke();ctx.restore();ctx.beginPath();ctx.moveTo(x+ox,y-h+4);ctx.lineTo(x+ox-w*0.3,y-h*0.6);ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=1;ctx.stroke();});
        for(let i=0;i<8;i++){const ang2=(i/8)*Math.PI*2+tick*0.03,px2=x+Math.cos(ang2)*r*0.5,py2=y+Math.sin(ang2)*r*0.28;const a=Math.max(0,Math.sin(tick*0.08+i));if(a>0.3){ctx.beginPath();ctx.arc(px2,py2,2,0,Math.PI*2);ctx.fillStyle=`rgba(160,240,255,${a})`;ctx.fill();}}
        ctx.beginPath();ctx.ellipse(x,y+r*0.18,r*0.5,r*0.1,0,0,Math.PI*2);ctx.fillStyle='rgba(100,220,255,0.15)';ctx.fill();

      } else if(theme==='sunset'){
        // Post office / mailbox contact island
        ctx.beginPath();ctx.rect(x-r*0.3,y-r*0.42,r*0.6,r*0.38);
        const bg=ctx.createLinearGradient(x,y-r*0.42,x,y-r*0.04);bg.addColorStop(0,'#e8703a');bg.addColorStop(1,'#c05020');ctx.fillStyle=bg;ctx.fill();ctx.strokeStyle='#8a3010';ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();ctx.moveTo(x-r*0.36,y-r*0.42);ctx.lineTo(x,y-r*0.65);ctx.lineTo(x+r*0.36,y-r*0.42);ctx.closePath();ctx.fillStyle='#c84820';ctx.fill();ctx.strokeStyle='#8a2810';ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();ctx.rect(x-r*0.08,y-r*0.22,r*0.16,r*0.2);ctx.fillStyle='#5a2808';ctx.fill();
        ctx.beginPath();ctx.rect(x-r*0.07,y-r*0.14,r*0.14,r*0.04);ctx.fillStyle='#c8a050';ctx.fill();
        for(let i=-1;i<=1;i+=2){
          const wx=x+i*r*0.2,wy=y-r*0.3;
          ctx.beginPath();ctx.rect(wx-r*0.07,wy-r*0.07,r*0.14,r*0.12);ctx.fillStyle='rgba(255,230,160,0.9)';ctx.fill();ctx.strokeStyle='#8a3010';ctx.lineWidth=1;ctx.stroke();
          ctx.beginPath();ctx.moveTo(wx,wy-r*0.07);ctx.lineTo(wx,wy+r*0.05);ctx.moveTo(wx-r*0.07,wy-r*0.01);ctx.lineTo(wx+r*0.07,wy-r*0.01);ctx.strokeStyle='#8a3010';ctx.lineWidth=0.8;ctx.stroke();
        }
        ctx.beginPath();ctx.rect(x+r*0.38,y-r*0.28,r*0.06,r*0.32);ctx.fillStyle='#7a4010';ctx.fill();
        ctx.beginPath();ctx.rect(x+r*0.3,y-r*0.38,r*0.22,r*0.14);ctx.fillStyle='#e05020';ctx.fill();ctx.strokeStyle='#8a2810';ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.ellipse(x+r*0.41,y-r*0.38,r*0.11,r*0.06,0,Math.PI,0);ctx.fillStyle='#e05020';ctx.fill();
        if(Math.sin(tick*0.04)>0){ctx.beginPath();ctx.moveTo(x+r*0.52,y-r*0.38);ctx.lineTo(x+r*0.52,y-r*0.52);ctx.strokeStyle='#7a4010';ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.rect(x+r*0.52,y-r*0.52,r*0.1,r*0.06);ctx.fillStyle='#ff3020';ctx.fill();}
        for(let i=0;i<3;i++){
          const ang2=tick*0.02+i*2.1,ex=x-r*0.5+Math.cos(ang2)*r*0.15,ey=y-r*0.2+Math.sin(ang2*0.7)*r*0.1-i*r*0.18;
          const ea=0.4+0.6*Math.sin(tick*0.05+i);
          ctx.save();ctx.globalAlpha=ea;ctx.translate(ex,ey);ctx.rotate(Math.sin(tick*0.03+i)*0.3);
          ctx.beginPath();ctx.rect(-10,-7,20,14);ctx.fillStyle='#f5e8d0';ctx.fill();ctx.strokeStyle='#c8a870';ctx.lineWidth=1;ctx.stroke();
          ctx.beginPath();ctx.moveTo(-10,-7);ctx.lineTo(0,1);ctx.lineTo(10,-7);ctx.strokeStyle='#c8a870';ctx.lineWidth=1;ctx.stroke();
          ctx.restore();
        }
        ctx.beginPath();ctx.ellipse(x,y+r*0.22,r*0.6,r*0.1,0,0,Math.PI*2);
        const sg=ctx.createRadialGradient(x,y+r*0.22,0,x,y+r*0.22,r*0.6);sg.addColorStop(0,'rgba(255,140,50,0.25)');sg.addColorStop(1,'rgba(255,80,20,0)');ctx.fillStyle=sg;ctx.fill();
      }

      ctx.save();ctx.shadowColor='rgba(0,0,0,0.95)';ctx.shadowBlur=8;
      ctx.fillStyle=t.accent;ctx.font='bold 13px Georgia,serif';ctx.textAlign='center';ctx.fillText(name,x,y+r*.62+20);
      ctx.fillStyle='rgba(255,240,180,0.7)';ctx.font='11px Georgia,serif';ctx.fillText(`[${lbl}]`,x,y+r*.62+34);ctx.restore();
    }

    // ── DRAW GOING MERRY ──
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
      ctx.beginPath();ctx.arc(-2.8,0.8,1.3,0,Math.PI*2);ctx.fillStyle='#333';ctx.fill();
      ctx.beginPath();ctx.arc(2.8,0.8,1.3,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(-2.2,0.2,0.5,0,Math.PI*2);ctx.fillStyle='white';ctx.fill();
      ctx.beginPath();ctx.arc(3.4,0.2,0.5,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(0,3,1.2,0,Math.PI*2);ctx.fillStyle='#ff9999';ctx.fill();
      ctx.restore();
      ctx.save();ctx.shadowColor='rgba(255,140,0,.9)';ctx.shadowBlur=14;ctx.beginPath();ctx.arc(0,26,3,0,Math.PI*2);ctx.fillStyle='#ffcc44';ctx.fill();ctx.restore();
      ctx.restore();
    }

    function drawWake(){
      wakeRef.current.forEach(p=>{
        const life=1-p.age/p.ma;
        ctx.beginPath();ctx.arc(p.wx,p.wy,3+(1-life)*18,0,Math.PI*2);ctx.fillStyle=`rgba(140,200,255,${life*0.2})`;ctx.fill();
      });
    }

    function drawCompass(H:number){
      const cr=32,cx=54,cy=H-54;
      ctx.save();ctx.globalAlpha=0.88;
      ctx.beginPath();ctx.arc(cx,cy,cr,0,Math.PI*2);ctx.fillStyle='rgba(8,20,40,0.92)';ctx.fill();ctx.strokeStyle='#c8a870';ctx.lineWidth=1.8;ctx.stroke();
      (['N','E','S','W'] as const).forEach((l,i)=>{
        const a=i*Math.PI/2;ctx.fillStyle=l==='N'?'#ff5555':'#c8a870';ctx.font='bold 8px Georgia,serif';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText(l,cx+Math.sin(a)*(cr-10),cy-Math.cos(a)*(cr-10));
      });
      ctx.save();ctx.translate(cx,cy);ctx.rotate(shipRef.current.ang);
      ctx.beginPath();ctx.moveTo(0,-(cr-6));ctx.lineTo(3.5,4);ctx.lineTo(-3.5,4);ctx.closePath();ctx.fillStyle='#ff4444';ctx.fill();
      ctx.beginPath();ctx.moveTo(0,cr-6);ctx.lineTo(3.5,-4);ctx.lineTo(-3.5,-4);ctx.closePath();ctx.fillStyle='#c8a870';ctx.fill();
      ctx.restore();ctx.restore();
    }

    // ── GAME LOOP ──
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
      s.x=Math.max(40,Math.min(W-40,s.x+s.vx));
      s.y=Math.max(40,Math.min(H-40,s.y+s.vy));
      if(spd>0.25&&tickRef.current%3===0)wakeRef.current.push({wx:s.x-Math.cos(s.ang)*24,wy:s.y-Math.sin(s.ang)*24,age:0,ma:45});
      wakeRef.current=wakeRef.current.map(p=>({...p,age:p.age+1})).filter(p=>p.age<p.ma);
      nearRef.current=null;
      islesRef.current.forEach(i=>{if(Math.hypot(s.x-i.x,s.y-i.y)<IDIST)nearRef.current=i;});
      setNear(nearRef.current?.id||null);
      drawOcean(W,H);
      islesRef.current.forEach(drawIsle);
      if(nearRef.current){
        const{x,y,r}=nearRef.current;
        ctx.save();ctx.globalAlpha=0.7+0.3*Math.sin(tickRef.current*0.12);
        ctx.beginPath();ctx.arc(x,y,r*0.62+28,0,Math.PI*2);
        ctx.strokeStyle=THEMES[nearRef.current.theme].accent;ctx.lineWidth=2.5;ctx.setLineDash([8,6]);ctx.stroke();ctx.setLineDash([]);ctx.restore();
      }
      drawWake();drawShip();drawCompass(H);
      animRef.current=requestAnimationFrame(loop);
    }
    animRef.current=requestAnimationFrame(loop);

    return()=>{
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize',resize);
      window.removeEventListener('keydown',kd);
      window.removeEventListener('keyup',ku);
      canvas.removeEventListener('click',onCanvasClick);
      canvas.removeEventListener('mousemove',onMouseMove);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[screen]);

  // ── LOADING SCREEN ──
  if(screen==='loading'){
    return(
      <div style={{position:'relative',width:'100%',height:'100vh',background:'#050c18',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Georgia,serif',color:'#f5e6c0',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,opacity:0.15,background:'repeating-linear-gradient(0deg,transparent,transparent 48px,rgba(80,150,240,0.5) 48px,rgba(80,150,240,0.5) 50px)'}}/>
        {Array.from({length:12}).map((_,i)=>(
          <div key={i} style={{position:'absolute',width:3,height:3,borderRadius:'50%',background:'rgba(200,168,100,0.4)',top:`${10+i*7}%`,left:`${5+i*8}%`,animation:`pulse ${2+i*0.3}s ease-in-out infinite alternate`}}/>
        ))}
        <style>{`@keyframes pulse{0%{opacity:0.2;transform:scale(1)}100%{opacity:0.8;transform:scale(1.6)}} @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
        <div style={{position:'relative',textAlign:'center',zIndex:2}}>
          <div style={{fontSize:48,marginBottom:20,filter:'drop-shadow(0 0 12px rgba(200,160,80,.4))'}}>🗺️</div>
          <p style={{fontSize:'1.1rem',letterSpacing:6,color:'#c8a870',textTransform:'uppercase',marginBottom:6}}>
            {loadText} <span style={{animation:'blink 1s infinite'}}>...</span>
          </p>
          <p style={{fontSize:'2.8rem',fontWeight:'bold',letterSpacing:2,margin:'10px 0 32px',textShadow:'0 0 40px rgba(200,160,80,.35)'}}>
            {Math.round(progress)}%
          </p>
          <div style={{width:280,height:3,background:'rgba(200,160,80,.15)',borderRadius:2,margin:'0 auto 12px',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${progress}%`,background:'linear-gradient(to right,#8a5010,#ffd060)',borderRadius:2,transition:'width 0.1s ease',boxShadow:'0 0 8px rgba(255,200,60,.5)'}}/>
          </div>
          <p style={{fontSize:10,color:'rgba(200,160,80,.3)',letterSpacing:3,textTransform:'uppercase'}}>Preparing your voyage</p>
        </div>
      </div>
    );
  }

  // ── SPLASH SCREEN ──
  if(screen==='splash'){
    return(
      <div style={{position:'relative',width:'100%',height:'100vh',background:'#050c18',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Georgia,serif',color:'#f5e6c0',overflow:'hidden',cursor:'default'}}>
        <div style={{position:'absolute',inset:0,opacity:0.12,background:'repeating-linear-gradient(0deg,transparent,transparent 48px,rgba(80,150,240,0.5) 48px,rgba(80,150,240,0.5) 50px)'}}/>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} @keyframes glow{0%,100%{text-shadow:0 0 30px rgba(200,160,80,.3)}50%{text-shadow:0 0 60px rgba(200,160,80,.7),0 0 100px rgba(200,160,80,.3)}} @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
        <div style={{position:'relative',zIndex:2,textAlign:'center',animation:'fadeUp 0.8s ease forwards'}}>
          <div style={{fontSize:56,marginBottom:16,animation:'float 3s ease-in-out infinite',filter:'drop-shadow(0 0 16px rgba(200,160,80,.5))'}}>⚓</div>
          <h1 style={{fontSize:'3rem',fontWeight:'bold',margin:'0 0 6px',animation:'glow 3s ease-in-out infinite',letterSpacing:3}}>Hey, I'm Kyle Lin</h1>
          <p style={{fontSize:13,color:'#c8a870',marginBottom:48,letterSpacing:2}}>Sail the seas to learn more about me</p>
          <button
            onClick={()=>setScreen('game')}
            style={{background:'transparent',border:'2px solid #c8a870',borderRadius:2,color:'#f5e6c0',fontFamily:'Georgia,serif',fontSize:'1.1rem',letterSpacing:6,padding:'14px 52px',cursor:'pointer',textTransform:'uppercase',transition:'all 0.2s ease'}}
            onMouseEnter={e=>{(e.target as HTMLButtonElement).style.background='rgba(200,160,70,.12)';(e.target as HTMLButtonElement).style.boxShadow='0 0 30px rgba(200,160,70,.3)';}}
            onMouseLeave={e=>{(e.target as HTMLButtonElement).style.background='transparent';(e.target as HTMLButtonElement).style.boxShadow='none';}}
          >Explore</button>
          <p style={{marginTop:18,fontSize:10,color:'rgba(200,160,80,.3)',letterSpacing:2,textTransform:'uppercase'}}>WASD or arrow keys to sail · Click islands to visit</p>
        </div>
      </div>
    );
  }

  // ── GAME ──
  return(
    <div style={{position:'relative',width:'100%',height:'100vh',overflow:'hidden',background:'#0b1d35',fontFamily:'Georgia,serif'}}>
      <canvas ref={cvsRef} style={{display:'block',width:'100%',height:'100%'}}/>
      <div style={{position:'absolute',top:14,left:16,color:'#f5e6c0',pointerEvents:'none',zIndex:5}}>
        <div style={{fontSize:15,fontWeight:'bold',textShadow:'0 0 10px rgba(200,168,80,.5)'}}>Hey, I'm Kyle Lin</div>
        <div style={{fontSize:10,color:'rgba(200,168,112,.5)',marginTop:3}}>WASD / ↑↓←→ to sail · E or click an island to visit</div>
      </div>
      {near&&(
        <div style={{position:'absolute',bottom:24,left:'50%',transform:'translateX(-50%)',background:'rgba(8,18,35,.93)',border:`1px solid ${THEMES[ISLE_DATA.find(i=>i.id===near)!.theme].accent}`,borderRadius:9,padding:'10px 26px',color:'#f5e6c0',fontSize:13,whiteSpace:'nowrap',pointerEvents:'none',zIndex:5}}>
          Press{' '}<kbd style={{background:'rgba(200,160,50,.2)',border:'1px solid #c8a870',borderRadius:3,padding:'1px 7px',fontWeight:'bold',fontFamily:'Georgia,serif'}}>E</kbd>{' '}or click to visit {ISLE_DATA.find(i=>i.id===near)?.name}
        </div>
      )}
      <div style={{position:'absolute',bottom:18,right:18,display:'grid',gridTemplateColumns:'38px 38px 38px',gridTemplateRows:'38px 38px 38px',gap:4,zIndex:5}}>
        {(['','dU','','dL','dD','dR'] as const).map((id,i)=>{
          if(!id)return <div key={i}/>;
          const label=id==='dU'?'↑':id==='dD'?'↓':id==='dL'?'←':'→';
          const key=id==='dU'?'ArrowUp':id==='dD'?'ArrowDown':id==='dL'?'ArrowLeft':'ArrowRight';
          return(
            <div key={id}
              onPointerDown={e=>{e.preventDefault();keysRef.current[key]=true;}}
              onPointerUp={()=>keysRef.current[key]=false}
              onPointerLeave={()=>keysRef.current[key]=false}
              style={{background:'rgba(200,160,70,.15)',border:'1px solid rgba(200,160,70,.4)',borderRadius:6,color:'#c8a870',fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',userSelect:'none',touchAction:'none'}}
            >{label}</div>
          );
        })}
      </div>
    </div>
  );
}
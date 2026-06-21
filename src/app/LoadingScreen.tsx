// LoadingScreen.tsx
"use client";

interface LoadingScreenProps {
  progress: number;
  loadText: string;
}

export default function LoadingScreen({ progress, loadText }: LoadingScreenProps) {
  return (
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

      <div style={{position:'absolute',inset:0,overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 60%,#0a2040 0%,#030912 70%)'}}/>
        <div style={{position:'absolute',bottom:0,left:0,width:'200%',height:'100%',animation:'waveScroll 8s linear infinite',opacity:0.12}}>
          {Array.from({length:14}).map((_,i)=>(
            <div key={i} style={{position:'absolute',left:0,right:0,height:2,top:`${20+i*6}%`,background:`rgba(80,${160+i*6},240,0.8)`,borderRadius:2,transform:`scaleX(${0.8+Math.sin(i)*0.2})`}}/>
          ))}
        </div>
        {Array.from({length:20}).map((_,i)=>(
          <div key={i} style={{position:'absolute',width:i%3===0?4:2,height:i%3===0?4:2,borderRadius:'50%',background:`rgba(${180+i*3},${160+i*4},${100+i*2},0.6)`,bottom:`${5+i*4}%`,left:`${3+i*5}%`,animation:`starFloat ${3+i*0.4}s ease-out ${i*0.3}s infinite`}}/>
        ))}
      </div>

      <div style={{position:'absolute',bottom:'28%',left:'50%',transform:'translateX(-50%)',animation:'boatRock 3s ease-in-out infinite',zIndex:3}}>
        <svg width="90" height="70" viewBox="0 0 90 70" fill="none">
          <path d="M10 40 Q45 55 80 40 L72 50 Q45 62 18 50 Z" fill="#c07030" stroke="#8a4010" strokeWidth="1.5"/>
          <path d="M10 40 L80 40" stroke="#1e2d5a" strokeWidth="3"/>
          <line x1="45" y1="40" x2="45" y2="5" stroke="#7a4010" strokeWidth="3"/>
          <path d="M45 8 Q62 18 62 36 L45 36 Z" fill="rgba(242,228,182,0.95)" stroke="#b89050" strokeWidth="1"/>
          <path d="M45 5 L55 9 L45 13 Z" fill="#c03020"/>
          <path d="M5 52 Q20 48 35 52 Q50 56 65 52 Q80 48 88 52" stroke="rgba(140,200,255,0.5)" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>

      <div style={{position:'absolute',top:'12%',right:'12%',zIndex:3}}>
        <div style={{position: 'relative',width:80,height:80}}>
          <div style={{position:'absolute',inset:-10,borderRadius:'50%',border:'1.5px solid rgba(200,168,80,0.3)',animation:'ringPulse 2s ease-out infinite'}}/>
          <div style={{position:'absolute',inset:-10,borderRadius:'50%',border:'1.5px solid rgba(200,168,80,0.3)',animation:'ringPulse 2s ease-out 0.7s infinite'}}/>
          <div style={{position:'absolute',inset:0,borderRadius:'50%',background:'rgba(8,20,40,0.95)',border:'2px solid #c8a870',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{position:'absolute',width:4,height:32,top:8,left:'calc(50% - 2px)',animation:'compassSpin 4s cubic-bezier(0.4,0,0.6,1) infinite',transformOrigin:'50% 75%',borderRadius:2,background:'linear-gradient(to bottom,#ff4444 50%,#c8a870 50%)'}}/>
            <div style={{position:'absolute',top:4,fontSize:9,fontWeight:'bold',color:'#ff5555',letterSpacing:1}}>N</div>
          </div>
        </div>
      </div>

      <div style={{position:'absolute',left:'6%',bottom:'22%',opacity:0.18,zIndex:2}}>
        <svg width="70" height="50" viewBox="0 0 70 50"><ellipse cx="35" cy="38" rx="32" ry="14" fill="#2a8a30"/><path d="M35 38 Q28 20 35 5 Q42 20 35 38Z" fill="#3a2a1a"/></svg>
      </div>
      <div style={{position:'absolute',right:'8%',bottom:'18%',opacity:0.14,zIndex:2}}>
        <svg width="50" height="38" viewBox="0 0 50 38"><ellipse cx="25" cy="28" rx="22" ry="12" fill="#4a7a9a"/><path d="M20 28 L25 8 L30 28Z" fill="#7090b0"/></svg>
      </div>

      <div style={{position:'relative',textAlign:'center',zIndex:4}}>
        <div style={{fontSize:'2.6rem',fontWeight:'bold',letterSpacing:4,marginBottom:6,background:'linear-gradient(90deg,#c8a060,#ffd060,#c8a060)',backgroundSize:'200%',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',animation:'barShine 2.5s linear infinite',filter:'drop-shadow(0 0 20px rgba(200,160,60,0.4))'}}>
          KYLE LIN
        </div>
        <div style={{fontSize:11,letterSpacing:8,color:'rgba(200,168,112,0.5)',textTransform:'uppercase',marginBottom:32}}>Portfolio</div>

        <div style={{marginBottom:10,fontSize:'0.85rem',letterSpacing:4,color:'#c8a870',textTransform:'uppercase',animation:'shimmer 1.5s ease-in-out infinite'}}>
          {loadText}<span style={{animation:'blink 0.8s infinite'}}> ···</span>
        </div>

        <div style={{position:'relative',width:320,margin:'0 auto 10px'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            {Array.from({length:11}).map((_,i)=>(
              <div key={i} style={{width:1,height:i%5===0?8:4,background:`rgba(200,160,80,${progress/100>i/10?0.6:0.2})`,transition:'all 0.3s'}}/>
            ))}
          </div>
          <div style={{height:4,background:'rgba(200,160,80,0.12)',borderRadius:2,overflow:'hidden',border:'1px solid rgba(200,160,80,0.15)'}}>
            <div style={{height:'100%',width:`${progress}%`,background:'linear-gradient(90deg,#6a3808,#c8a020,#ffd060)',borderRadius:2,transition:'width 0.12s ease',boxShadow:'0 0 12px rgba(255,200,60,0.6)',backgroundSize:'200%',animation:'barShine 1.5s linear infinite'}}/>
          </div>
          <div style={{marginTop:8,fontSize:'1.8rem',fontWeight:'bold',color:'#f5e6c0',letterSpacing:2,textShadow:'0 0 20px rgba(200,160,80,0.5)'}}>
            {Math.round(progress)}<span style={{fontSize:'0.9rem',color:'rgba(200,168,112,0.5)',marginLeft:2}}>%</span>
          </div>
        </div>

        <div style={{fontSize:9,color:'rgba(200,160,80,0.25)',letterSpacing:4,textTransform:'uppercase',marginTop:4}}>Preparing your voyage</div>
      </div>
    </div>
  );
}
"use client";
import type { Skill } from "../../app/resumeData"

export default function Skill({name, img, imgAlt}: Skill) {
  return (
    <div style={{
      background:'rgba(255,255,255,0.05)',
      border:'1px solid rgba(200,160,70,.2)',
      borderRadius:10,
      height:90,width:90,
      display:'flex',alignItems:'center',justifyContent:'center',
      flexDirection:'column',gap:6,textAlign:'center',
      transition:'border-color 0.2s ease,box-shadow 0.2s ease',
      cursor:'default',
    }}>
      <img src={img} width={40} alt={imgAlt} style={{objectFit:'contain'}}/>
      <span style={{fontSize:10,letterSpacing:0.5,color:'rgba(200,168,112,0.8)',fontFamily:'Georgia,serif'}}>{name}</span>
    </div>
  );
}
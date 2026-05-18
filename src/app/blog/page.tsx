import Link from "next/link";
import connectDB from "../../database/db";
import blogSchema from "../../database/blogSchema";

async function getBlogs(){
  try {
    await connectDB();
    const blogs = await blogSchema.find().sort({ date: -1 });
    return blogs ?? [];
  } catch (err) {
    console.error('Blog DB error:', err);
    return [];
  }
}

export default async function Blog() {
  const posts = await getBlogs();

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
        .blog-card{display:block;background:rgba(255,255,255,0.03);border:1px solid rgba(200,160,70,.18);border-radius:14px;padding:28px 32px;text-decoration:none;color:#f5e6c0;transition:border-color 0.25s ease,box-shadow 0.25s ease,transform 0.25s ease;}
        .blog-card:hover{border-color:rgba(200,160,70,.5);box-shadow:0 0 40px rgba(200,160,70,.1);transform:translateY(-3px);}
        .blog-card:hover .card-arrow{transform:translateX(4px);}
        .card-arrow{transition:transform 0.2s ease;color:rgba(200,160,80,.5);}
        .back-link{color:rgba(200,160,80,.6);font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;transition:color 0.2s ease;}
        .back-link:hover{color:#c8a870;}
        .footer-back{color:rgba(200,160,80,.6);font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;transition:color 0.2s ease;}
        .footer-back:hover{color:#c8a870;}
      `}</style>

      <div style={{position:'relative',zIndex:1,maxWidth:680,margin:'0 auto',padding:'100px 24px 80px'}}>

        {/* Header */}
        <div style={{textAlign:'center',marginBottom:64,animation:'fadeUp 0.6s ease forwards'}}>
          <h1 style={{fontSize:'2.8rem',fontWeight:'bold',margin:'0 0 10px',letterSpacing:3,animation:'glow 3s ease-in-out infinite'}}>
            Blog
          </h1>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,marginTop:16}}>
            <div style={{width:60,height:1,background:'linear-gradient(to right,transparent,rgba(200,160,80,0.4))'}}/>
            <div style={{fontSize:13,color:'rgba(200,160,80,0.5)'}}>✦</div>
            <div style={{width:60,height:1,background:'linear-gradient(to left,transparent,rgba(200,160,80,0.4))'}}/>
          </div>
          <p style={{marginTop:16,fontSize:12,color:'rgba(200,168,112,0.5)',letterSpacing:3,textTransform:'uppercase'}}>
            {posts.length} {posts.length===1?'entry':'entries'} in the log
          </p>
        </div>

        {/* Posts */}
        {posts.length===0 ? (
          <div style={{textAlign:'center',padding:'60px 0',color:'rgba(200,168,112,0.4)',fontSize:14,letterSpacing:2}}>
            No posts found.
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {posts.map((post, idx) => (
              <Link
                key={String(post._id)}
                href={`/blog/${post.slug}`}
                className="blog-card"
                style={{animation:`cardIn 0.5s ease ${idx*0.1}s both`}}
              >
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16}}>
                  <div style={{flex:1,minWidth:0}}>
                    <h2 style={{fontSize:'1.15rem',fontWeight:'bold',margin:'0 0 6px',letterSpacing:1}}>
                      {post.title}
                    </h2>
                    {post.date && (
                      <p style={{fontSize:11,color:'rgba(200,160,80,0.45)',letterSpacing:2,textTransform:'uppercase',margin:'0 0 8px'}}>
                        {post.date}
                      </p>
                    )}
                    {post.description && (
                      <p style={{fontSize:12,color:'rgba(200,168,112,0.5)',margin:0,lineHeight:1.6,
                        overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'} as React.CSSProperties}>
                        {post.description}
                      </p>
                    )}
                  </div>
                  <span className="card-arrow" style={{fontSize:18,flexShrink:0}}>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{textAlign:'center',marginTop:56,paddingTop:32,borderTop:'1px solid rgba(200,160,70,.1)'}}>
          <Link href="/?go=game" className="footer-back">← Back to the Sea</Link>
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";
import BlogPreview from "../../../components/blogPreview/blogPreview";

type Props = {
  params: Promise<{ slug: string }>
}

async function getBlog(slug: string) {
  try {
    const baseURL = process.env.NEXT_PUBLIC_PROD_URL!;
    const res = await fetch(`${baseURL}/api/blog/${slug}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch blog");
    return res.json();
  } catch (err: unknown) {
    console.log(`error: ${err}`);
    return null;
  }
}

export default async function Blog(props: Props) {
  const { slug } = await props.params;
  const blog = await getBlog(slug);

  return (
    <div style={{minHeight:'100vh',background:'#050c18',fontFamily:'Georgia,serif',color:'#f5e6c0',position:'relative',overflow:'hidden'}}>

      {/* Back link */}
      <div style={{position:'fixed',top:20,left:24,zIndex:10}}>
        <Link href="/blog" className="back-link">← Back to Blog</Link>
      </div>

      {/* Ocean line background */}
      <div style={{position:'fixed',inset:0,opacity:0.08,background:'repeating-linear-gradient(0deg,transparent,transparent 48px,rgba(80,150,240,0.5) 48px,rgba(80,150,240,0.5) 50px)',pointerEvents:'none',zIndex:0}}/>

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{text-shadow:0 0 20px rgba(200,160,80,.2)}50%{text-shadow:0 0 40px rgba(200,160,80,.6)}}
        .back-link{color:rgba(200,160,80,.6);font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;transition:color 0.2s ease;}
        .back-link:hover{color:#c8a870;}
        .footer-back{color:rgba(200,160,80,.6);font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;transition:color 0.2s ease;}
        .footer-back:hover{color:#c8a870;}
      `}</style>

      <div style={{position:'relative',zIndex:1,maxWidth:760,margin:'0 auto',padding:'100px 24px 80px'}}>

        {!blog ? (
          /* Not found state */
          <div style={{textAlign:'center',padding:'60px 0',animation:'fadeUp 0.6s ease forwards'}}>
            <h2 style={{fontSize:'1.5rem',fontWeight:'bold',margin:'0 0 12px',letterSpacing:2}}>Post Not Found</h2>
            <p style={{color:'rgba(200,168,112,0.5)',marginBottom:32,fontSize:13}}>This entry has been lost to the sea.</p>
            <Link href="/blog" className="back-link">← Back to Blog</Link>
          </div>
        ) : (
          <div style={{animation:'fadeUp 0.6s ease forwards'}}>

            {/* Post header */}
            <div style={{textAlign:'center',marginBottom:48}}>
              <h1 style={{fontSize:'2.2rem',fontWeight:'bold',margin:'0 0 10px',letterSpacing:2,animation:'glow 3s ease-in-out infinite'}}>
                {blog.title}
              </h1>
              {blog.date && (
                <p style={{fontSize:11,color:'rgba(200,160,80,0.5)',letterSpacing:3,textTransform:'uppercase',margin:'8px 0 0'}}>
                  {blog.date}
                </p>
              )}
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,marginTop:20}}>
                <div style={{width:60,height:1,background:'linear-gradient(to right,transparent,rgba(200,160,80,0.35))'}}/>
                <div style={{fontSize:12,color:'rgba(200,160,80,0.4)'}}>✦</div>
                <div style={{width:60,height:1,background:'linear-gradient(to left,transparent,rgba(200,160,80,0.35))'}}/>
              </div>
            </div>

            {/* Blog content card */}
            <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(200,160,70,.15)',borderRadius:16,padding:'40px',backdropFilter:'blur(12px)'}}>
              <BlogPreview
                key={blog.slug}
                title={blog.title}
                date={blog.date}
                description={blog.description}
                image={blog.image}
                imageAlt={blog.imageAlt}
                comments={blog.comments}
                slug={blog.slug}
              />
            </div>

            {/* Footer */}
            <div style={{textAlign:'center',marginTop:48,paddingTop:32,borderTop:'1px solid rgba(200,160,70,.1)'}}>
              <Link href="/blog" className="footer-back">← Back to Blog</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
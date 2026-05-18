export type IComment = {
  user: string;
  comment: string;
  time: Date | string;
};

type CommentProps = {
  comments: IComment[];
}

function parseCommentTime(time: Date | string){
  if(!time) return '';
  // If it's already a plain readable string, just return it
  if(typeof time === 'string' && isNaN(Date.parse(time))) return time;
  try {
    return new Date(time).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  } catch {
    return String(time);
  }
}

function Comment({ comments }: CommentProps) {
  if (!comments || comments.length === 0) {
    return (
      <div style={{textAlign:'center',padding:'24px 0',color:'rgba(200,168,112,0.3)',fontSize:12,letterSpacing:2,textTransform:'uppercase'}}>
        No comments yet. Be the first!
      </div>
    );
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:20}}>
      {comments.map((comment, index) => (
        <div key={index} style={{
          background:'rgba(255,255,255,0.03)',
          border:'1px solid rgba(200,160,70,.12)',
          borderRadius:10,
          padding:'14px 18px',
        }}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
            <span style={{fontWeight:'bold',fontSize:13,color:'#f5e6c0',letterSpacing:1}}>
              {comment.user}
            </span>
            <span style={{fontSize:10,color:'rgba(200,160,80,0.4)',letterSpacing:1,textTransform:'uppercase'}}>
              {parseCommentTime(comment.time)}
            </span>
          </div>
          <p style={{fontSize:13,lineHeight:1.7,color:'rgba(200,168,112,0.75)',margin:0}}>
            {comment.comment}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Comment;
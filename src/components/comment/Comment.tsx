import style from './comment.module.css'


{/* When we pass props, the name that we use to pass values
		is the key for the type
*/}

export type IComment = {
  user: string;
  comment: string;
  time: Date;
};

type CommentProps = {
    comments: IComment[];
}


{/* Modularizing code into seperate functions is useful.
		Makes your code look nicer and allows for better readability.
	*/}
function parseCommentTime(time: Date){

    const date = time.toString();
    const month = date.slice(5,7);
    const day = date.slice(8,10);
    const dayNumber = Number(day);
    const year = date.slice(0, 4);

    const months: Record<string, string> = {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'
    };

    return (months[month] + ' ' + dayNumber + ', ' + year)


}

function Comment({ comments }: CommentProps) {
    return (
        <div className = {style.comments}>
            {comments.map ((comment, index) =>
                <div className = {style.commentContainer} key = {index}>
                    <div className = {style.userText}>{comment.user}</div>
                    <div className = {style.commentText}>{comment.comment}</div>
                <div className = {style.dateText}>{parseCommentTime(comment.time)}</div>
            </div>
            )}

        </div>
    );
}

export default Comment;
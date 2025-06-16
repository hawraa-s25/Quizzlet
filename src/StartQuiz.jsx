export default function StartQuiz(props){
    return(
        <div id="startPage">
            <h1>Quizzical</h1>
            <p>Are you ready to test your knowledge? Take this fun quiz now!</p>
            <button onClick={props.onClick} className="start">Start quiz</button>
        </div>
    )
}
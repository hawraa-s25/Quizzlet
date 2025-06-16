
import './App.css'
import React from "react"
import StartQuiz from './StartQuiz'
import MainPage from "./MainPage"
import {clsx} from "clsx"

function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5)
}
export default function App() {
    const [startShown,setStart] = React.useState(true)
    const [questions, setQuestions] = React.useState([])
    const [selectedAnswers, setAnswers] = React.useState({})
    const [showCheckButton, setShowCheckButton] = React.useState(false)
    const [showLoadButton, setLoadButton] = React.useState(false)
    const [correctCount, setCount]=React.useState(0)
    const [hasChecked, setChecked]=React.useState(false)
    const buttonName="checkAndPlay"

    function HandleStartQuiz(){
        setStart(false)
        setLoadButton(true)
    }

    function restart(){
        setAnswers([])
        setShowCheckButton(true)
        setCount(0)
        setChecked(false)
        fetchQuestions()
    }

    function fetchQuestions() {
        fetch("https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple")
        .then(res => res.json())
        .then(data => {
            const shuffledQuestions = data.results.map(q => ({
                ...q,
                shuffledAnswers: shuffleArray([q.correct_answer, ...q.incorrect_answers])
            }))
            setQuestions(shuffledQuestions)
            setShowCheckButton(true)
            setLoadButton(false)
        })
    }

    function countCorrectAnswers(){
        let count=0
        questions.map((q,index)=>{
            if (selectedAnswers[index]===q.correct_answer){
                count++
            }
        })
        setCount(count)
        setChecked(true)
        setShowCheckButton(false)
        
    }


    const QandA=(questions.map((q,index) =>{
        const answers = q.shuffledAnswers
        
        function chosenAnswer(questionIndex,answer){
            setAnswers(prevAnswers=> {
                    return {...prevAnswers,[questionIndex]:answer}
                
            })

        }

        return (
        <div key={index}>
            <h3 dangerouslySetInnerHTML={{__html:q.question}} />
            <div className="answerSection">
                {answers.map((a,i)=>{
                    const isChosen=selectedAnswers[index]===a
                    const isCorrect= a===q.correct_answer
                    const className=clsx("answerButton",{
                        chosen:isChosen && !hasChecked,
                        correct: hasChecked && isCorrect,
                        wrong: hasChecked && isChosen && !isCorrect
                    })
                    return(  
                        <button onClick={()=>chosenAnswer(index,a)} className={className} key={i}
                        dangerouslySetInnerHTML={{ __html: a }}/>
                    )
                })}
            </div>
            <hr/>
        </div>
        )
    }))

    

    return (
        <div>
        {startShown ? <StartQuiz onClick={HandleStartQuiz}/>
        :<MainPage 
        displayQandA={QandA}
        fetchQ={fetchQuestions}
        />
        }
        {showCheckButton===true && 
            <button onClick={countCorrectAnswers} className={buttonName}>Check answers</button>
        }
        {showLoadButton===true &&
            <div className="loadingPage">
                <h2>Ready to play?!</h2>
                <p>Click here 😉👇🏻</p>
                <button onClick={fetchQuestions} className="loadButton">Load Questions</button>
            </div>
        }
        {hasChecked===true&&
            <div className="playAgain">
                <p>You scored {correctCount}/5 correct answers</p>
                <button onClick={restart} className={buttonName}>Play again</button>
            </div>
            }
        </div>
    )
}
   

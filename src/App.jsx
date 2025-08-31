
import './App.css'
import React from "react"
import StartQuiz from './StartQuiz'
import MainPage from "./MainPage"
import {clsx} from "clsx"
import {FETCH_STATUS} from "./fetchStatus"
import ThemeContext from './ThemeContext'

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
    const [changeCategory, setChange] = React.useState(false)
    const [category, setCategory]=React.useState(0)
    const [status, setStatus]=React.useState(FETCH_STATUS.IDLE)

    const buttonName="checkAndPlay"
    const {theme, toggleTheme} = React.useContext(ThemeContext)

    React.useEffect(()=>{
        document.body.style.backgroundColor = theme === "light" ? "#F5F7FB" : "#293264"
        document.body.style.color = theme === "light" ? "#293264" : "#F5F7FB"
    },[theme])

    function HandleStartQuiz(){
        setStart(false)
        setLoadButton(true)
    }

    function restart(){
        setAnswers([])
        setShowCheckButton(true)
        setCount(0)
        setChecked(false)
        fetchQuestions(category)
    }

    function fetchQuestions(categoryType) {
        try{
            setStatus(FETCH_STATUS.LOADING)
            fetch(`https://opentdb.com/api.php?amount=5&category=${categoryType}&difficulty=easy&type=multiple`)
            .then(res => res.json())
            .then(data => {
                const shuffledQuestions = data.results.map(q => ({
                    ...q,
                    shuffledAnswers: shuffleArray([q.correct_answer, ...q.incorrect_answers])
                }))
                setCategory(categoryType)
                setQuestions(shuffledQuestions)
                setShowCheckButton(true)
                setLoadButton(false)
                setStatus(FETCH_STATUS.SUCCESS)
                setChange(false)
            })
        }catch(er){
            setStatus(FETCH_STATUS.ERROR)
        }
    }

    React.useEffect(() => {
        if (showLoadButton === false) return
        fetchQuestions(category)
    }, [category])


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

    function chooseNewCategory(){
        setChange(true)         // show categories again
        setChecked(false)       // hide score screen
        setQuestions([])        // clear old questions
        setAnswers({})          // clear selected answers
        setShowCheckButton(false)
        setLoadButton(true)     // show category chooser
        setCount(0)    
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
                        dangerouslySetInnerHTML={{ __html: a } } disabled={hasChecked}/>
                    )
                })}
            </div>
            <hr/>
        </div>
        )
    }))


    return (
        <div>
        {startShown ? <StartQuiz onClick={HandleStartQuiz} changeTheme={toggleTheme}/>
        :<MainPage 
        displayQandA={QandA}
        />
        }
        {showCheckButton===true && 
            <button onClick={countCorrectAnswers} className={buttonName}>Check answers</button>
        }
        {(changeCategory===true || showLoadButton===true) &&
            <div className="loadingPage">
                <h2>Ready to play?!</h2>
                <p>Choose a category 😉👇🏻</p>
                <div className="categoryTypes">
                    <button onClick={()=>fetchQuestions(22)} className="loadButton">Geography</button>
                    <button onClick={()=>fetchQuestions(21)} className="loadButton">Sports</button>
                    <button onClick={()=>fetchQuestions(9)} className="loadButton">General Knowledge</button>
                </div>
                {status===FETCH_STATUS.LOADING && <p>Just a moment while we load the questions...</p>}
                {status===FETCH_STATUS.ERROR && <p>Something went wrong</p>}
            </div>
        }
        {hasChecked===true&&
            <div className="playAgain">
                <p>You scored {correctCount}/5 correct answers</p>
                <button onClick={restart} className={buttonName}>Play again</button>
                <button onClick={chooseNewCategory} className={buttonName}>Choose A New Category</button>
            </div>
            }
        </div>
    )
}
   

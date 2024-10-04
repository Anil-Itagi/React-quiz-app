
import { useEffect } from 'react';
import StartScreen  from './StartScreen';
import { useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import Question from './Question'
import NextButton from './NextButton'
import Progress from './Progress';
import Finish from './Finish';
import Restart from './Restart';
import Timer from './Timer';
const sec_per_question = 30;
const initialState = {
    questions: [],
    //loading ,error , ready, active ,finished
    status: 'loading',
    index: 0,
    points: 0,
    answer: null,
    highscore: 0,
    secondsRemaining:null,
}

function reducer(state, action) {
    switch (action.type) {
        case 'dataReceived': return {
            ...state,
            questions: action.payload,
            status:"ready"
        }
        case 'dataFailed': return {
            ...state,
            status:"Error"
        }
        case 'start': return {
            ...state, status: "active",
            secondsRemaining: state.questions.length *sec_per_question,
          
        
        }
        case 'newAnswer':
            const question = state.questions.at(state.index);
            return {

                ...state,
                answer: action.payload,
                points: action.payload === question.correctOption 
                    ? state.points + question.points 
                    :state.points,
            }
        case 'nextQuestion': return { ...state, index: state.index + 1, answer: null }
        case 'finish':
            return {
                ...state, status: 'finished',
                highscore: state.highscore > state.points ? state.hishscore : state.points,
            }
        case 'restart': return {
            ...initialState, questions: state.questions, status: "ready",
         
            
        }
        case 'tick': return {
            ...state,
            secondsRemaining: state.secondsRemaining - 1,
            status:state.secondsRemaining===0?"finished":state.status,
        }
        default: throw new Error("Action unknown");
    }
    
}
export default function App() {

    const [{ questions, status,index,answer,points=0,highscore,secondsRemaining}, dispatch] = useReducer(reducer, initialState)
    const numQuestions = questions.length;
    const maxPossiblePoints=questions.reduce((prev,cur)=>prev+cur.points,0)
    useEffect(function () {
        fetch("https://github.com/Anil-Itagi/React-quiz-app/blob/main/data/questions.json")
            .then((res) => res.json()
                .then((data) => dispatch({ type: 'dataReceived',payload:data }))
                .catch((err) => dispatch({type:"dataFailed"}))
        )
    }, [])
    console.log(points+" alskdnfoansdf")
    return (
        <div className="app">
            <Header />
            <Main>
                {status === 'loading' && <Loader />}
                {status === 'Error' && <Error />}
                {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />} 
                {status === 'active' && <>
                    <Progress index={index + 1} numQuestion={numQuestions} points={points} maxPossiblePoints={ maxPossiblePoints} answer={answer} />
                    <Question question={questions[index]} dispatch={dispatch} answer={answer} />
                    
                    <footer>

                        <Timer dispatch={dispatch}secondsRemaining={secondsRemaining} />
                    <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions} />
                    </footer>
                </>
                } 

                {status === 'finished' &&
                    <>
                        <Finish points={points} maxPossiblePoints={maxPossiblePoints} highscore={highscore} />
                        <Restart dispatch={dispatch} />
                    </>}
            </Main>
                     
        </div>
    )
}

import { useEffect } from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Loader from './components/Loader'
import Error from './components/Error'
import { useReducer } from 'react';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import NextButton from './components/NextButton';
import Progress from './components/Progress';
import FinishScreen from './components/FinishScreen';

const initialState = {
  questions: [],

  //loading, error, ready, active, finished
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
};

function reducer(state, action) {
  switch(action.type){
    case 'dataReceived':
      return{
        ...state,
        questions: action.payload,
        status: "ready"
      };
    case 'dataFailed':
      return {
        ...state,
        status: 'error'
      };
    case 'start':
      return{
        ...state,
        status: 'active'
      }  
    case 'newAnswer':
      const question = state.questions.at(state.index)

      return {
        ...state, 
        answer: action.payload, 
        points: action.payload === question.correctOption ? state.points + question.points : state.points,
      }
    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null };
    case 'finish':
      return {...state, status: 'finish', highscore: state.points > state.highscore ? state.points : state.highscore}
    default:
      throw new Error('Action unknown')
  }
}

export default function App(){
  const [{questions, status, index, answer, points, highscore}, dispatch] = useReducer(reducer, initialState)

  //derived state
  const numQuestions = questions.length
  const maxPoints = questions.reduce((prev, cur)=> prev + cur.points, 0);

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then(data => dispatch({ type: 'dataReceived', payload: data}))
      .catch(err=> dispatch({type: 'dataFailed' }));
  }, [])
  
  return (
    <div className='app'>
      <Header />

      <Main className='main'>
        {status === 'loading' && <Loader />}
        {status === 'errpr' && <Error />}
        {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch}/>}
        {status === 'active' && (
          <>
            <Progress index={index} numQuestions={numQuestions} points={points} maxPoints={maxPoints} answer={answer} />
            <Question question={questions[index]} dispatch={dispatch} answer={answer} />
            <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions}/>
          </>
          
        )}
        {status === 'finished' && <FinishScreen points={points} maxPoints={maxPoints} highscore={highscore} />}
      </Main>
    </div>
  )
}
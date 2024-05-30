import { useEffect } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader'
import Error from './Error'
import { useReducer } from 'react';
import StartScreen from './StartScreen';

const initialState = {
  questions: [],

  //loading, error, ready, active, finished
  status: 'loading'
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
      }
    default:
      throw new Error('Action unknown')
  }
}

export default function App(){
  const [{questions, status}, dispatch] = useReducer(reducer, initialState)

  //derived state
  const numQuestions = questions.length

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
        {status === 'ready' && <StartScreen numQuestions={numQuestions}/>}
      </Main>
    </div>
  )
}
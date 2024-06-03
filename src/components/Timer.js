import { useEffect } from "react"

function Timer({dispatch, secondsRemaining}) {
    const mins = Math.floor(secondsRemaining / 60)
    const seconds = secondsRemaining % 60
    console.log(secondsRemaining);
    console.log(seconds);
    useEffect(function(){
        const id = setInterval(() => {
            dispatch({type: 'tick'})
        }, 1000);
        //clean up function to cancel the timer
        return () => clearInterval(id)
    }, [dispatch])
    return (
        <div className="timer">
            {mins < 10 && "0"}
            {mins}:{seconds < 10 && "0"}
            {seconds}
        </div>
    )
}

export default Timer

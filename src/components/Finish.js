function Finish({ points ,maxPossiblePoints,highscore}) {
    const percentage = (points / maxPossiblePoints) * 100;
    return (
        <>
        <p className="result">
            you scored <strong>{points }  </strong>
                out of {maxPossiblePoints} ({Math.ceil(percentage)}%)</p>
            
            <p class="highscore">
        ( Highest score is   { highscore} points )
            </p>
        </>
    )
}

export default Finish;
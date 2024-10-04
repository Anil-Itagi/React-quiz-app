function Restart({dispatch}) {
    return <button className="btn btn-ui"
        onClick={() =>
            dispatch({ type: 'restart' })}>
        Restart Quiz
    </button>
}

export default Restart;
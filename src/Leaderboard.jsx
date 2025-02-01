function Leaderboard({ leaderboard }) {
    return (
      <div className="leaderboard">
        <h2>تصنيف المتسابقين</h2>
        <ol>
          {leaderboard.map((entry, index) => (
            <li key={index} className={`top-${index + 1}`}>
              {entry.name}: {entry.score.toFixed(2)}% {/* Display percentage */}
            </li>
          ))}
        </ol>
      </div>
    );
  }
  
  export default Leaderboard;
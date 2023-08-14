import { useState } from 'react';
import './styles.css'
// import { Howl } from 'howler'; // for sound effects

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={`square ${value} ${highlight ? 'highlight' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares, i);
  }

  const winnerData = calculateWinner(squares);
  let winningLine = winnerData ? winnerData.line : [];
  let status;
  if (winnerData) {
    status = 'Winner: ' + winnerData.winner;
  } else if (squares.every(square => square)) {
    status = "It's a draw!";
  } else {
    status = 'Side to play: ' + (xIsNext ? 'X' : 'O');
  }
  return (
    <>
      <div className="status">{status}</div>
      {[0, 1, 2].map((row) => (
        <div key={row} className="board-row">
          {[0, 1, 2].map((col) => {
            const index = row * 3 + col;
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
                highlight={winningLine.includes(index)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const [isAscending, setIsAscending] = useState(true);


  function handlePlay(nextSquares, i) {
    const newRow = Math.floor(i / 3) + 1;
    const newCol = (i % 3) + 1;
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, row: newRow, col: newCol }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((step, move) => {
    const { row, col } = step;  // extract row and col from each step
    let description;
    if (move === currentMove) {
      description = 'You are at move #' + move + (row && col ? ` (row ${row}, col ${col})` : "");
    } else if (move > 0) {
      description = 'Go to move #' + move + ` (row ${row}, col ${col})`;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="game-container">
      <h1 className="title">X Tic-Tac-Toe O</h1>
      <div className="game">
        <div className="how-to-play">
          <h2>How to Play</h2>
          <p>Click on any square to place your mark.</p>
        </div>
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <h2>Moves</h2>
          <button onClick={() => setIsAscending(!isAscending)}>
            {isAscending ? 'Sort: Descending' : 'Sort: Ascending'}
          </button>
          <ol>{sortedMoves}</ol>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] }; // modified return value
    }
  }
  return null;
}


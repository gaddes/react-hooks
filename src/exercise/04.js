// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import { useLocalStorageState } from '../utils';

function Board({ squares, onClick }) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

// Game > Board

// 1) `squares` in Game should be [[], [], []] (i.e. array of arrays)
// 2) `currentSquares` in Board should be [] (i.e. single array)
// 3) `moves in Game should be [] (i.e. array of indices representing move #)
// 4) `currentMove` in Game should be a single number representing index of current move
//     Game will use this value to pick out relevant `currentSquares` before passing down to Board

function Game() {
  // MANAGED state
  const [squares, setSquares] = useLocalStorageState('squares', [Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useLocalStorageState('currentMove', 0);

  // DERIVED state
  const currentSquares = squares[currentMove];
  const nextValue = calculateNextValue(currentSquares);
  const winner = calculateWinner(currentSquares);
  const status = calculateStatus(winner, currentSquares, nextValue);

  const moves = squares.map((_, boardIndex) => {
    let text = `Go to move #${boardIndex}`;
    if (boardIndex === 0) { text = 'Go to game start' };
    if (boardIndex === currentMove) { text += ' (current)' };

    return (
      <li>
        <button
          onClick={() => setCurrentMove(boardIndex)}
          disabled={boardIndex === currentMove}
        >
          {text}
        </button>
      </li>
    )
  });

  const selectSquare = (square) => {
    if (winner || currentSquares[square]) return;

    const currentSquaresCopy = [...currentSquares];
    currentSquaresCopy[square] = nextValue;

    let squaresCopy = [...squares];

    if (currentMove === squares.length - 1) {
      setCurrentMove(move => move + 1);
    } else {
      // If current move is not the latest move (i.e. user has stepped back in history),
      // then blitz all future moves and start recording from this point onwards.
      squaresCopy = squaresCopy.slice(0, currentMove + 1);
      setCurrentMove(currentMove + 1);
    }

    squaresCopy.push(currentSquaresCopy);
    setSquares(squaresCopy);
  };

  function restart() {
    setSquares([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  console.log({ squares, currentMove });

  return (
    <div className="game">
    <div className="game-board">
      <Board onClick={selectSquare} squares={currentSquares} />
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
    <div className="game-info">
      <div>{status}</div>
      <ol>{moves}</ol>
    </div>
  </div>
  );
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App

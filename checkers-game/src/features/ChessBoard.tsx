import { useState } from "react";
import "./ChessBoard.css";
import Square from "./Square";

export default function ChessBoard() {
  const [boardState, setBoardState] = useState([
    [0, 2, 0, 2, 0, 2, 0, 2, 0, 2], // __
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0], // player (2)
    [0, 2, 0, 2, 0, 2, 0, 2, 0, 2], // one
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0], // __
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1], // middle 
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // zone
    [0, 3, 0, 3, 0, 3, 0, 3, 0, 3], // __
    [3, 0, 3, 0, 3, 0, 3, 0, 3, 0], // player (3)
    [0, 3, 0, 3, 0, 3, 0, 3, 0, 3], // two
    [3, 0, 3, 0, 3, 0, 3, 0, 3, 0], // __
  ]);
  const [playerOneTurn, setPlayerOneTurn] = useState(true);

  function handleClick(value: number, boardIndex: number, rowIndex: number) {
    if (value == 2 && playerOneTurn) {
      console.log("Black clicked! Player one turn over.", boardIndex, rowIndex);
      movePiece("black", boardIndex, rowIndex);
      //setPlayerOneTurn(false);
    } else if (value == 3 && !playerOneTurn) {
      console.log("White clicked! Player two turn over.");
      setPlayerOneTurn(true);
    }
  }

  function movePiece(turn: string, boardIndex: number, rowIndex: number) {
    const newBoard = boardState.map(row => [...row]);
    newBoard[boardIndex][rowIndex] = 1; 
    setBoardState(newBoard);
  }

  return (
    <div>
      {boardState.map((row, boardIndex) => (
        <div key={boardIndex} className="chessRow">
          {row.map((value, rowIndex) => (
            <div key={rowIndex}>
              <Square
                onClick={() => handleClick(value, boardIndex, rowIndex)}
                key={`${boardIndex}-${rowIndex}`}
                index={value}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

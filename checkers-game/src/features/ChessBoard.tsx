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
  const [prevPlayerPos, setPrevPlayerPos] = useState({ bI: -1, rI: -1 });
  const [validMoves, setValidMoves] = useState<{ bI: number; rI: number }[]>(
    []
  );
  const [canMove, setCanMove] = useState(false);
  const [mustKill, setMustKill] = useState(false);
  const [playerOneTurn, setPlayerOneTurn] = useState(true);
  const [capturedWhitePieces, setCapturedWhitePieces] = useState(0);
  const [capturedBlackPieces, setCapturedBlackPieces] = useState(0);

  function handleClick(value: number, boardIndex: number, rowIndex: number) {
    console.log(
      `val: ${value} | bI: ${boardIndex} | rI: ${rowIndex} | mustKill ${mustKill}`
    );
    if (canMove) {
      // movement handler
      const newBoard = boardState.map((row) => [...row]);
      if (!mustKill && value == 4) {
        setCanMove(false);
        newBoard[prevPlayerPos.bI][prevPlayerPos.rI] = 1;
        for (const move of validMoves) {
          newBoard[move.bI][move.rI] = 1;
        }
        if (!playerOneTurn) newBoard[boardIndex][rowIndex] = 2;
        else {
          newBoard[boardIndex][rowIndex] = 3;
        }
      }
      setBoardState(newBoard);
    }

    if (mustKill) {
      // killer handler
      const newBoard = boardState.map((row) => [...row]);
      for (const move of validMoves) {
        if (boardIndex === move.bI && rowIndex === move.rI) {
          if (boardState[move.bI][move.rI] === 6) {
            setCapturedBlackPieces(+1);
            newBoard[move.bI][move.rI] = 2;
          } else if (boardState[move.bI][move.rI] === 5) {
            setCapturedWhitePieces(+1);
            newBoard[move.bI][move.rI] = 3;
          }
          newBoard[prevPlayerPos.bI][prevPlayerPos.rI] = 1;
          console.log("slaughter!");
          setBoardState(newBoard);
          setMustKill(false);
        }
      }
    }

    if (value == 2 && playerOneTurn) {
      movePiece("white", boardIndex, rowIndex);
      setPlayerOneTurn(false);
    } else if (value == 3 && !playerOneTurn) {
      movePiece("black", boardIndex, rowIndex);
      setPlayerOneTurn(true);
    }
  }

  function movePiece(turn: string, boardIndex: number, rowIndex: number) {
    const newBoard = boardState.map((row) => [...row]);
    movementCheck(turn, boardIndex, rowIndex, newBoard);
    setBoardState(newBoard);
  }

  function movementCheck(
    turn: string,
    boardIndex: number,
    rowIndex: number,
    newBoard: any
  ) {
    let tempValidMoves: { bI: number; rI: number }[] = [];
    setPrevPlayerPos({ bI: boardIndex, rI: rowIndex });
    if (turn == "white") {
      const boardIndexOne = boardIndex + 1;
      const possibleRows = [rowIndex + 1, rowIndex - 1];
      let tempMustKill = false;
      for (let r of possibleRows) {
        if (boardState[boardIndexOne][r] === 3) {
          // capture black
          console.log("white player can capture");
          newBoard[boardIndexOne][r] = 6;
          tempValidMoves.push({ bI: boardIndexOne, rI: r });
          setValidMoves(tempValidMoves);
          setMustKill(true), (tempMustKill = true);
        }
        if (boardState[boardIndexOne][r] === 1 && tempMustKill === false) {
          // move normally
          newBoard[boardIndexOne][r] = 4;
          tempValidMoves.push({ bI: boardIndexOne, rI: r });
        }
      }

      if (tempValidMoves.length >= 1) {
        setValidMoves(tempValidMoves);
        setCanMove(true);
      }
    } else if (turn == "black") {
      const boardIndexOne = boardIndex + -1;
      const possibleRows = [rowIndex + 1, rowIndex - 1];

      for (let r of possibleRows) {
        if (boardState[boardIndexOne][r] === 1) {
          newBoard[boardIndexOne][r] = 4;
          tempValidMoves.push({ bI: boardIndexOne, rI: r });
        }
      }

      if (tempValidMoves.length >= 1) {
        setValidMoves(tempValidMoves);
        setCanMove(true);
      }
    }
  }

  function TellPlayerTurn() {
    if (playerOneTurn) return <h2>It's your turn: Player One</h2>;
    else return <h2>It's your turn: Player Two</h2>;
  }

  return (
    <div>
      <TellPlayerTurn />
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

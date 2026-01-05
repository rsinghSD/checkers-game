import { useState } from "react";
import "./ChessBoard.css";
import Square from "./Square";

/*
  // value 0 = empty brown
  // value 1 = empty white
  // value 2 = occupied white 
  // value 3 = occupied black 
  // value 4 = movement box
  // value 5 = white captureable
  // value 6 = black captureable
*/

export default function ChessBoard() {
  const [boardState, setBoardState] = useState([
    [0, 1, 0, 1, 0, 2, 0, 2, 0, 2], // __
    [1, 0, 8, 0, 3, 0, 2, 0, 2, 0], // player (2)
    [0, 1, 0, 1, 0, 2, 0, 2, 0, 2], // one
    [1, 0, 1, 0, 1, 0, 2, 0, 2, 0], // __
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1], // middle
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // zone
    [0, 3, 0, 3, 0, 1, 0, 1, 0, 1], // __
    [3, 0, 3, 0, 1, 0, 1, 0, 1, 0], // player (3)
    [0, 3, 0, 3, 0, 2, 0, 7, 0, 1], // two
    [3, 0, 3, 0, 1, 0, 1, 0, 1, 0], // __
  ]);
  //   const [boardState, setBoardState] = useState([
  //   [0, 2, 0, 2, 0, 2, 0, 2, 0, 2], // __
  //   [2, 0, 2, 0, 2, 0, 2, 0, 2, 0], // player (2)
  //   [0, 2, 0, 2, 0, 2, 0, 2, 0, 2], // one
  //   [2, 0, 2, 0, 2, 0, 2, 0, 2, 0], // __
  //   [0, 1, 0, 1, 0, 1, 0, 1, 0, 1], // middle
  //   [1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // zone
  //   [0, 3, 0, 3, 0, 3, 0, 3, 0, 3], // __
  //   [3, 0, 3, 0, 3, 0, 3, 0, 3, 0], // player (3)
  //   [0, 3, 0, 3, 0, 3, 0, 3, 0, 3], // two
  //   [3, 0, 3, 0, 3, 0, 3, 0, 3, 0], // __
  // ]);
  const [prevPlayerPos, setPrevPlayerPos] = useState({ bI: -1, rI: -1 });
  const [validMoves, setValidMoves] = useState<{ bI: number; rI: number }[]>([]);
  const [prevEnemyPos, setPrevEnemyPos] = useState({ bI: -1, rI: -1})
  const [ValidCapturePoints, setValidCapturePoints] = useState<{ bI: number; rI: number }[]>([]);
  const [canMove, setCanMove] = useState(false);
  const [mustKill, setMustKill] = useState(false);
  const [playerOneTurn, setPlayerOneTurn] = useState(true);
  const [capturedWhitePieces, setCapturedWhitePieces] = useState(0);
  const [capturedBlackPieces, setCapturedBlackPieces] = useState(0);
  const [isCrowned, setIsCrowned] = useState(false); // if current piece is crowned

  function handleClick(value: number, boardIndex: number, rowIndex: number) {
    console.log(
      `val: ${value} | bI: ${boardIndex} | rI: ${rowIndex} | mustKill ${mustKill} | isCrowned ${isCrowned}`
    );

    if (mustKill) {
      const newBoard = boardState.map((row) => [...row]);
      newBoard[prevPlayerPos.bI][prevPlayerPos.rI] = 1;
      if (boardState[prevPlayerPos.bI][prevPlayerPos.rI] === 2 || boardState[prevPlayerPos.bI][prevPlayerPos.rI] === 7) {
        for (const cap of ValidCapturePoints) { // this was pretty much unneeded as its a single value
          newBoard[cap.bI][cap.rI] = 2
        }
        setCapturedBlackPieces(+ 1);
      } else if (boardState[prevPlayerPos.bI][prevPlayerPos.rI] === 3 || boardState[prevPlayerPos.bI][prevPlayerPos.rI] === 8) {
        for (const cap of ValidCapturePoints) {
          newBoard[cap.bI][cap.rI] = 3
        }
        setCapturedWhitePieces(+ 1);
      }
      newBoard[prevEnemyPos.bI][prevEnemyPos.rI] = 1;
      setBoardState(newBoard)
      setMustKill(false);
    }

    if (canMove) {
      // movement handler
      const newBoard = boardState.map((row) => [...row]);
      if (!mustKill && value == 4) {
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
      setCanMove(false);
    }

    if (value === 2 || value === 7 && playerOneTurn) {
      if (value === 7)
        setIsCrowned(true);
      movePiece("white", boardIndex, rowIndex);
      setPlayerOneTurn(false);
    } else if (value == 3 || value == 8 && !playerOneTurn) {
      if (value === 8)
        setIsCrowned(true);
      movePiece("black", boardIndex, rowIndex);
      setPlayerOneTurn(true);
    }
  }

  function movePiece(turn: string, boardIndex: number, rowIndex: number) {
    const newBoard = boardState.map((row) => [...row]);
    movementCheck(turn, boardIndex, rowIndex, newBoard);
    setBoardState(newBoard);
  }

  function movementCheck( turn: string, boardIndex: number, rowIndex: number, newBoard: any) {
    let tempValidMoves: { bI: number; rI: number }[] = [];
    let tempValidCapturePoints: {bI: number; rI: number}[] = [];
    const possibleRows = [rowIndex + 1, rowIndex - 1];
    setPrevPlayerPos({ bI: boardIndex, rI: rowIndex });

    let tempMustKill = false;
    let crownable = false;
    let boardIndexOne = boardIndex + 1;
    let boardIndexTwo = boardIndex + 2;

    let enemyValue = 3;
    let capturableValue = 6;
    let crownCheck = 10
    if (turn === "black") { // avoids duplicated code by if turn === black.. white etc
      boardIndexOne = boardIndex - 1;
      boardIndexTwo = boardIndex - 2;
      enemyValue = 2;
      capturableValue = 5;
      crownCheck = -1;
    }

      for (let r of possibleRows) { 
        const enemyRow = boardIndexOne;
        const enemyCol = r;
        const landingRow = boardIndexTwo;
        const landingCol = enemyCol + (enemyCol - rowIndex);

        if(boardState[landingRow] === undefined) {
          crownable = true;
          console.log(landingRow)
          throw new Error("Crowning possible! It's not a bug, it's a feature.")
        }

        if (boardState[enemyRow][enemyCol] === enemyValue && boardState[landingRow][landingCol] === 1 && !crownable) {        
          setPrevEnemyPos({ bI: enemyRow, rI: enemyCol})
          tempValidCapturePoints.push({bI: landingRow, rI: landingCol})
          newBoard[enemyRow][enemyCol] = capturableValue
          tempMustKill = true;
          setMustKill(true);
        }
      }
      for (let r of possibleRows) {
        if (!tempMustKill){
          if (boardState[boardIndexOne][r] === 1 && tempMustKill === false) {
            newBoard[boardIndexOne][r] = 4;
            tempValidMoves.push({ bI: boardIndexOne, rI: r });
          }
        }
      }

      if (tempValidMoves.length >= 1) {
        setValidMoves(tempValidMoves);
        setCanMove(true);
      } else if (tempValidCapturePoints.length >= 1)
        setValidCapturePoints(tempValidCapturePoints);
  }

  function TellPlayerTurn() {
    if (playerOneTurn) return <h2>It's your turn: Player One</h2>;
    else return <h2>It's your turn: Player Two</h2>;
  }

  return (
    <div>
      <TellPlayerTurn />
      <p>Player one got captured {capturedWhitePieces} times</p>
      <p>Player two got captured {capturedBlackPieces} times</p>
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

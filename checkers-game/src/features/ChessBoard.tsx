import { useState } from "react";
import { useEffect } from "react";
import "./ChessBoard.css";
import Square from "./Square";
import CreateNewGame from "./CreateNewGame"
import SaveGame from "./SaveGame";
import GetExistingGame from "./GetExistingGame";
/*
  // value 0 = empty brown
  // value 1 = empty white
  // value 2 = occupied white 
  // value 3 = occupied black 
  // value 4 = movement box
  // value 5 = white captureable
  // value 6 = black captureable
  // value 7 = white crowned
  // value 8 = black crowned
*/

interface ChessBoardProps {
  status: string;
  loadGame: boolean;
  game_id: string;
}
export default function ChessBoard({status, loadGame, game_id}: ChessBoardProps) {
    const [boardState, setBoardState] = useState([
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1], // __
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // player (1)
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1], // one
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // __
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1], // middle
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // zone
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1], // __
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // player (1)
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 2], // two
    [1, 0, 1, 0, 1, 0, 1, 0, 3, 0], // __
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
  const [gameId, setGameId] = useState("Awaiting response from server...");
  const [saveGame, setSaveGame] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [prevPlayerPos, setPrevPlayerPos] = useState({ bI: -1, rI: -1 });
  const [validMoves, setValidMoves] = useState<{ bI: number; rI: number }[]>([]);
  const [prevEnemyPos, setPrevEnemyPos] = useState({ bI: -1, rI: -1})
  const [ValidCapturePoints, setValidCapturePoints] = useState<{landing: {bI: number; rI: number}; enemy: {bI: number; rI: number}}[]>([]);
  const [canMove, setCanMove] = useState(false);
  const [lockedPiece, setLockedPiece] = useState({ bI: -1, rI: -1})
  const [pieceIsLocked, setPieceIsLocked] = useState(false);
  const [mustKill, setMustKill] = useState(false);
  const [playerOneTurn, setPlayerOneTurn] = useState(true);
  const [capturedWhitePieces, setCapturedWhitePieces] = useState(0);
  const [capturedBlackPieces, setCapturedBlackPieces] = useState(0);
  const [isCrowned, setIsCrowned] = useState(false); // if current piece is crowned

  useEffect(() => {
    async function initGame() {
      if (!isSetup && status === "started") {
        const gameId = await CreateNewGame();
        setGameId(gameId);
        setIsSetup(true);
      }
    }
    initGame();
  }, [isSetup, status])

  useEffect(() => {
    async function getGame() {
      setGameId("Please wait...")
      if (status === "saved" && loadGame === true) {
        const body = await GetExistingGame(game_id)

        if (body === "Not Found") {
          setGameId(`Game "${game_id}" not found. Try again.`)
          loadGame = false;
          return;
        }
        if (body.message[0].game_id && loadGame === true)  {
          const res = body.message[0]
          const player_state = JSON.parse(res.player_state);

          setBoardState(JSON.parse(res.board_state))
          setCanMove(player_state.can_move);
          setCapturedBlackPieces(player_state.captured_black_pieces);
          setCapturedWhitePieces(player_state.captured_white_pieces);
          setMustKill(player_state.must_kill)
          setLockedPiece(player_state.locked_piece)
          setPieceIsLocked(player_state.piece_is_locked)
          setPrevEnemyPos(player_state.prev_enemy_pos);
          setPrevPlayerPos(player_state.prev_player_pos);
          setValidCapturePoints(player_state.valid_capture_points);
          setValidMoves(player_state.valid_moves)
          setPlayerOneTurn(res.player_one_turn);
          setGameId(res.game_id);
        }
      }
    }
    getGame();
  }, [])


  useEffect(() => {
    async function saveTheGame() {
      if (saveGame) {
        console.log("Save triggered.");
        const body = {
          game_id: gameId,
          board_state: boardState,
          player_state: {
            prev_player_pos: prevPlayerPos,
            valid_moves: validMoves,
            prev_enemy_pos: prevEnemyPos,
            valid_capture_points: ValidCapturePoints,
            can_move: canMove,
            locked_piece: lockedPiece,
            piece_is_locked: pieceIsLocked,
            must_kill: mustKill, 
            player_one_turn: playerOneTurn,
            captured_white_pieces: capturedWhitePieces,
            captured_black_pieces: capturedBlackPieces
          },
          player_one_turn: playerOneTurn
        }

        await SaveGame(body);
        alert("Game has been saved, you may quit the checkers session now.")
      }
    }

    saveTheGame();
  }, [saveGame])

  function handleClick(value: number, boardIndex: number, rowIndex: number) {
    
    console.log(
      `val: ${value} | bI: ${boardIndex} | rI: ${rowIndex} | mustKill ${mustKill} | isCrowned ${isCrowned} | lockedPiece ${lockedPiece.bI} ${lockedPiece.rI}`
    );

    let tempCanMove = false;
    if (canMove) tempCanMove = true;
    if (mustKill) {
      if (!pieceIsLocked) {
        setLockedPiece({bI: boardIndex, rI: rowIndex});
        setPieceIsLocked(true);
      }
      if (lockedPiece) {
        if (boardIndex !== lockedPiece.bI || rowIndex !== lockedPiece.rI)
          return;
      }

      const capture = ValidCapturePoints.find(c =>
        c.landing.bI === boardIndex && c.landing.rI === rowIndex
      );

      if (!capture) return;

      const newBoard = boardState.map(row => [...row]);

      let enemyValue = newBoard[capture.enemy.bI][capture.enemy.rI];
      let playerValue = newBoard[prevPlayerPos.bI][prevPlayerPos.rI];

        ValidCapturePoints.forEach(c => {
        newBoard[c.enemy.bI][c.enemy.rI] = enemyValue; // 5 or 6
      });

      newBoard[prevPlayerPos.bI][prevPlayerPos.rI] = 1;
      newBoard[capture.landing.bI][capture.landing.rI] = boardState[prevPlayerPos.bI][prevPlayerPos.rI];

      if(canCrown(playerValue, capture.landing.bI)) {
        if (playerValue === 2) newBoard[capture.landing.bI][capture.landing.rI] = 7
        if (playerValue === 3) newBoard[capture.landing.bI][capture.landing.rI] = 8
      }
      
      newBoard[capture.enemy.bI][capture.enemy.rI] = 1;

      setBoardState(newBoard);

      const moreCaptures = ValidCapturePoints.filter(c => 
        c.enemy.bI !== capture.enemy.bI || c.enemy.rI !== capture.enemy.rI
      );

      if (moreCaptures.length > 0) {
        setValidCapturePoints(moreCaptures);
        setLockedPiece(capture.landing);
        setPieceIsLocked(true);
        setMustKill(true);
        setPrevPlayerPos(capture.landing);
      } else {
        setValidCapturePoints([]);
        setLockedPiece({ bI: -1, rI: -1 });
        setPieceIsLocked(false);
        setCanMove(false);
        tempCanMove = false;
        setMustKill(false);
        setPlayerOneTurn(prev => !prev);
      }

      setBoardState(newBoard);

      // setMustKill(false);
      // 
    }

    //fixExtraMovementBoxes();
    
    if (tempCanMove) {
      let playerPieceValue = 2;
      let crownPieceValue = 7;
      if (playerOneTurn) {
        playerPieceValue = 3
        crownPieceValue = 8;
      }
      // movement handler
      const newBoard = boardState.map((row) => [...row]);
      if (!mustKill && value == 4) {
        newBoard[prevPlayerPos.bI][prevPlayerPos.rI] = 1;

        for (const move of validMoves) {
          newBoard[move.bI][move.rI] = 1;
        }

        if(isCrowned) {
          newBoard[boardIndex][rowIndex] = crownPieceValue
          setIsCrowned(false);
        } else if (!isCrowned) {
          newBoard[boardIndex][rowIndex] = playerPieceValue
        }
      }

      setBoardState(newBoard);
      setCanMove(false);
    }

    checkWinCondition();
    checkBlocked("white")
    checkBlocked("black")

    if ((value === 2 || value === 7) && playerOneTurn) {
      if (value === 7) {
        setIsCrowned(true);
        console.log("Crowned player detected!")
      }
      movePiece("white", boardIndex, rowIndex);
      setPlayerOneTurn(false);
    } else if ((value === 3 || value === 8 ) && !playerOneTurn) {
      if (value === 8) {
      setIsCrowned(true);
      console.log("Crowned player detected!")        
      }
      movePiece("black", boardIndex, rowIndex);
      setPlayerOneTurn(true);
    }
  }

  function canCrown(val: number, bI: number) {
    if (val === 2 && bI === boardState.length -1) return true;
    if (val === 3 && bI === 0) return true
  }

  function movePiece(turn: string, boardIndex: number, rowIndex: number) {
    const newBoard = boardState.map((row) => [...row]);
    movementCheck(turn, boardIndex, rowIndex, newBoard);
    setBoardState(newBoard);
  }


  function movementCheck( turn: string, boardIndex: number, rowIndex: number, newBoard: any) { 
    let tempValidMoves: { bI: number; rI: number }[] = []; 
    let tempValidCapturePoints: {landing: {bI: number, rI: number}, enemy: {bI: number, rI: number}}[] = [];
    const possibleRows = [rowIndex + 1, rowIndex - 1];
    const possibleCrownMovement = [boardIndex + 1, boardIndex + -1];
    setPrevPlayerPos({ bI: boardIndex, rI: rowIndex });

    let tempMustKill = false; // pre initialization values to use for movement logic
    let boardIndexOne = boardIndex + 1;
    let boardIndexTwo = boardIndex + 2;

    let enemyValue = 3;
    let capturableValue = 6;
    let crownValue = 8
    let crownRow = 9;

    let tempIsCrowned = false;
    if (turn === "black") { // avoids duplicated code by if turn === black.. white etc (it used to be duplicated code with if statements...)
      boardIndexOne = boardIndex - 1;
      boardIndexTwo = boardIndex - 2;
      enemyValue = 2;
      capturableValue = 5;
      crownValue = 7;
      crownRow = 0;
    }
    if (boardState[boardIndex][rowIndex] === 7 || boardState[boardIndex][rowIndex] === 8)
      tempIsCrowned = true;

      for (let r of possibleRows) { 
        const enemyRow = boardIndexOne;
        const enemyCol = r;


        const landingRow = boardIndexTwo
        const landingCol = enemyCol + (enemyCol - rowIndex); 

        if(boardIndexOne === crownRow) {
          setIsCrowned(true);
          console.log("crowning possible @ ", boardIndexOne)
        }

        if ( // Kill detection for normal pieces
          (!tempIsCrowned) &&
          enemyRow >= 0 && enemyRow < boardState.length &&
          enemyCol >= 0 && enemyCol < boardState[enemyRow].length &&
          landingRow >= 0 && landingRow < boardState.length &&
          landingCol >= 0 && landingCol < boardState[landingRow].length
        ) {
          if ((boardState[enemyRow][enemyCol] === enemyValue || boardState[enemyRow][enemyCol] === crownValue) && boardState[landingRow][landingCol] === 1) {    
            console.log("kill detection on")    
            setPrevEnemyPos({ bI: enemyRow, rI: enemyCol})
            tempValidCapturePoints.push({ landing: { bI: landingRow, rI: landingCol}, enemy: {bI: enemyRow, rI: enemyCol} })
            newBoard[enemyRow][enemyCol] = capturableValue
            tempMustKill = true;
            setMustKill(true);
          }
        }
      }

        if (tempIsCrowned) { // Kill detection for crowned pieces
          const directions = [
            { dRow: 1, dCol: 1},
            { dRow: 1, dCol: -1},
            { dRow: -1, dCol: 1},
            { dRow: -1, dCol: -1}
          ];

          for (const {dRow, dCol} of directions){
            const enemyRow = boardIndex + dRow;
            const enemyCol = rowIndex + dCol;

            const landingRow = enemyRow + dRow;
            const landingCol = enemyCol + dCol;

            if(
              enemyRow >= 0 && enemyRow < boardState.length &&
              enemyCol >= 0 && enemyCol < boardState[enemyRow].length &&
              landingRow >= 0 && landingRow < boardState.length &&
              landingCol >= 0 && landingCol < boardState[landingRow].length
            ) {
              if ((boardState[enemyRow][enemyCol] === enemyValue || boardState[enemyRow][enemyCol] === crownValue) && boardState[landingRow][landingCol] === 1) {
                console.log("CROWN KILL DEtection on!", turn);
                tempValidCapturePoints.push({
                  landing: { bI: landingRow, rI: landingCol},
                  enemy: { bI: enemyRow, rI: enemyCol}
                })
                newBoard[enemyRow][enemyCol] = capturableValue;
                tempMustKill = true;
                setMustKill(true);
              }
            }
          }
        } 
        
      for (let r of possibleRows) {  // Movement for Crowned pieces
        for(let m of possibleCrownMovement) {
          if (m >= 0 && m < boardState.length && r >= 0 && r < boardState[m].length) {
            if (tempIsCrowned && !tempMustKill){
              if (boardState[m][r] === 1) {
                newBoard[m][r] = 4;
                tempValidMoves.push({bI: m, rI: r})
              }
            }
          }
        }

        if (!tempMustKill && !tempIsCrowned){ // Movement for Normal pieces
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

  function checkWinCondition() {
    const flatboard = boardState.flat();
    if(!flatboard.some(val => val === 2 || val === 7)) alert("Black wins!");
    if(!flatboard.some(val => val === 3 || val === 8)) alert("White wins!")
  }

  function checkBlocked(player: "white" | "black") {
  const values = player === "white" ? [2, 7] : [3, 8];
  const direction = player === "white" ? 1 : -1; 

  const blocked = !boardState.some((row, bI) =>
    row.some((cell, rI) => {
      if (!values.includes(cell)) return false;
      const moves = [
        [bI + direction, rI + 1],
        [bI + direction, rI - 1]
      ];
      return moves.some(([newBI, newRI]) =>
        newBI >= 0 && newBI < boardState.length &&
        newRI >= 0 && newRI < boardState[0].length &&
        boardState[newBI][newRI] === 1
      );
    })
  );

  let winningPlayer;
  if (player === "white") winningPlayer = "black"
  if (player === "black") winningPlayer = "white"

  if (blocked) alert(`${player} has no valid moves! ${winningPlayer} won!`);
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
      <p>gameId: {gameId}</p>
      <button className="menuButtony" onClick={() => setSaveGame (true)}>Save Game</button>
    </div>
  );
}

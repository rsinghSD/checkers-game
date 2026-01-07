import { useState } from "react"
import { useEffect } from "react";
import ChessBoard from "./features/ChessBoard";
export default function LoadForm() {
    const [gameId, setGameId] = useState("");
    const [showChess, setShowChess] = useState(false);

    const handleLoadGame = async () => {
        if (!gameId) {
            alert("No gameId was given.");
            return;
        }
        setShowChess(true);
    }



    return (
        <>
            <div className="formGroup">
                {!showChess && 
                    <>
                        <h3>Please input your game_id here to load a existing checkers game.</h3>
                        <p>example: 82b667a4-f766-4005-8e8f-6b16aa2aa3e9</p>
                        <label>
                            game_id: <input name="myInput" value={gameId} onChange={(e) => setGameId(e.target.value)} />
                            <button className="button-3" onClick={handleLoadGame}> Submit ID</button>
                        </label>
                        <p>Don't have a game_id? Start a new game, and remember the game's id!</p>
                    </>
                }


                {showChess && (
                    <ChessBoard status="saved" loadGame={true} game_id={gameId} />
                )}
            </div>

        </>
    )
}
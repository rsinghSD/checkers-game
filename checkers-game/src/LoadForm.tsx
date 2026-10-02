import { useState } from "react"
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
                        <label>
                            game_id: <input name="myInput" value={gameId} onChange={(e) => setGameId(e.target.value)} />
                            <button className="button-3" onClick={handleLoadGame}> Submit ID</button>
                        </label>
                        <p>Don't have a game_id? Start a new game, and remember the game's id!</p>
                        <p> Or try out these ones: <br />
                        82c009db-ae2b-4db4-8a4a-79d43bf58b69 - chaos <br />
                        4f2b70c7-31df-4686-b1b4-7b596c22b222 - chaos v2 <br />
                        b766bc4b-6171-453e-b008-467c5a186ecb - chaos v3 <br />
                        82b667a4-f766-4005-8e8f-6b16aa2aa3e9 - example game <br />
                        318864b7-6bc8-438b-859b-57c93d87deb8 - crowned testing <br />
                        825f7ba5-93e1-4642-9e41-987d5010560f - circles <br />
                        247f260a-712e-4b15-8af0-ab0fe6058c19 - test 101 (avg developer sandbox) <br />
                        936dc6b3-a54c-4d38-ab60-f5daaa6c826e - broken movement spaces <br />
                        19fff7e5-208d-4c4f-baaf-f9eead185670 - kings vs kings <br />
                        dff3e30f-aaa9-45b4-be12-d258bde7723e - graduation test <br />
                        52d23d8f-4b87-4a75-a54a-2d7fd4274e93 - checkers but you can't move <br />
                        </p>
                    </>
                }
                {showChess && (
                    <ChessBoard status="saved" loadGame={true} game_id={gameId} />
                )}
            </div>

        </>
    )
}
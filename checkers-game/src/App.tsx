import { useState } from "react";
import "./App.css";
import ChessBoard from "./features/ChessBoard";
import About from "./About";
import LoadForm from "./LoadForm";
import { FaGithub } from "react-icons/fa";

function App() {
  const [showGame, setShowGame] = useState(false)
  const [showAbout, setShowAbout] = useState(false);
  const [showAskId, setShowAskId] = useState(false);


  return (
    <>
    <div className="menu">
        {!showGame && !showAbout && !showAskId && (
        <>
          <h1> Welcome to the Checkers Game!</h1>
          <button className="menuButton" onClick={() => setShowGame(true)}> Start new Game</button>
          <button className="menuButton" onClick={() => setShowAskId(true)}>Load existing Game</button>
          <button className="menuButton" onClick={() => setShowAbout(true)}>About Game</button>
          <a
            className="icon"
            href="https://github.com/bambaclad1"
          >
            <FaGithub />
          </a>
        </>
      )}
    </div>

      {showGame && <ChessBoard status="started" loadGame={false} game_id="" />}
      {showAskId && <LoadForm />}
      {showAbout && <About />}

    </>
  );
}

export default App;

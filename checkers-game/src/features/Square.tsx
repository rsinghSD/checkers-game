import "./Square.css";
import { useState } from "react";

type SquareProps = {
  index: number
  onClick: () => void
}
export default function Square({index, onClick}: SquareProps) {
  const [value, setValue] = useState(0); // integer state
  let squareClass = "";
  let piece;
  // value 0 = empty brown
  // value 1 = empty white
  // value 2 = occupied white 
  // value 3 = occupied black 
  // value 4 = movement box
  // value 5 = white captureable
  // value 6 = black captureable
  // value 7 = white crowned
  // value 8 = black crowned
  switch (index) {
    case 0:
      squareClass = "emptyBrown";
      break;
    case 1:
      squareClass = "emptyWhite";
      break;
    case 2:
      squareClass = "emptyWhite";
      piece = <div className="pieceWhite"></div>;
      break;
    case 3:
      squareClass = "emptyWhite";
      piece = <div className="pieceBlack"></div>;
      break;
    case 4:
      squareClass = "possibleMove"
      break;
    case 5:
      squareClass = "captureWhite"
      piece = <div className="pieceWhite"></div>
      break;
    case 6:
      squareClass = "captureWhite"
      piece = <div className="pieceBlack"></div>
      break;
    case 7:
      squareClass = "emptyWhite"
      piece = <div className="kingWhite"></div>
      break;
    case 8:
      squareClass = "emptyWhite"
      piece = <div className="kingBlack"></div>
      break;
  }

  return <button onClick={onClick} className={squareClass}>{piece}</button>;
}

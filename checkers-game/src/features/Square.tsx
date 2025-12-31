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
  // value 2 = occupied black white
  // value 3 = occupied white white
  switch (index) {
    case 0:
      squareClass = "emptyBrown";
      break;
    case 1:
      squareClass = "emptyWhite";
      break;
    case 2:
      squareClass = "emptyWhite";
      piece = <div className="pieceBlack"></div>;
      this
      break;
    case 3:
      squareClass = "emptyWhite";
      piece = <div className="pieceWhite"></div>;
      break;
  }

  return <button onClick={onClick} className={squareClass}>{piece}</button>;
}

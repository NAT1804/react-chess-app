import React, { useEffect, useState } from "react";
import BoardSquare from "./BoardSquare";

const Board = ({ board, position }) => {
  const [currentBoard, setCurrentBoard] = useState([]);
  useEffect(() => {
    setCurrentBoard(position === "w" ? board.flat() : board.flat().reverse());
  }, [board, position]);
  const getXYPosition = (i) => {
    const x = position === "w" ? i % 8 : Math.abs((i % 8) - 7);
    const y =
      position === "w" ? Math.abs(Math.floor(i / 8) - 7) : Math.floor(i / 8);
    return { x, y };
  };
  const isBlack = (i) => {
    const { x, y } = getXYPosition(i);
    return (x + y) % 2 === 0;
  };
  const getPosition = (i) => {
    const { x, y } = getXYPosition(i);
    const letter = ["a", "b", "c", "d", "e", "f", "g", "h"][x];
    return `${letter}${y + 1}`;
  };
  return (
    <div className="board">
      {currentBoard.map((piece, i) => {
        return (
          <div key={i} className="square">
            <BoardSquare
              piece={piece}
              black={isBlack(i)}
              position={getPosition(i)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Board;

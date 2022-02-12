import React, { useEffect, useState } from "react";
import Square from "./Square";
import Piece from "./Piece";
import { useDrop } from "react-dnd";
import { handleMove } from "./Game";
import { gameSubject } from "./Game";
import Promotion from "./Promotion";

const BoardSquare = ({ piece, black, position }) => {
  const [promotion, setPromotion] = useState(null);
  const [, drop] = useDrop({
    accept: "piece",
    drop: (item) => {
      const [fromPosition] = item.id.split("_");
      handleMove(fromPosition, position);
    },
  });
  useEffect(() => {
    const subscribe = gameSubject.subscribe(({ pendingPromotion }) =>
      pendingPromotion && pendingPromotion.to === position
        ? setPromotion(pendingPromotion)
        : setPromotion(null)
    );

    return () => subscribe.unsubscribe();
  }, []);
  return (
    <div className="board-square" ref={drop}>
      <Square black={black}>
        {promotion ? (
          <Promotion promotion={promotion} />
        ) : piece ? (
          <Piece piece={piece} position={position} />
        ) : null}
      </Square>
    </div>
  );
};

export default BoardSquare;

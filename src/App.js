import { useEffect, useState } from "react";
import "./App.css";
import Board from "./Board";
import { gameSubject, initGame } from "./Game";

function App() {
  const [board, setBoard] = useState([]);
  useEffect(() => {
    initGame();
    const subscribe = gameSubject.subscribe((game) => setBoard(game.board));
    return () => subscribe.unsubscribe();
  }, []);

  return (
    <div className="container">
      <div className="board-container">
        <Board board={board} />
      </div>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import "./App.css";
import Board from "./Board";
import { gameSubject, initGame, resetGame } from "./Game";

function App() {
  const [board, setBoard] = useState([]);
  const [isGameOver, setIsGameOver] = useState();
  const [result, setResult] = useState();

  useEffect(() => {
    initGame();
    const subscribe = gameSubject.subscribe((game) => {
      setBoard(game.board);
      setIsGameOver(game.isGameOver);
      setResult(game.result);
    });
    return () => subscribe.unsubscribe();
  }, []);

  return (
    <div className="container">
      {isGameOver && (
        <h2 className="vertical-text">
          GAME OVER
          <button onClick={resetGame}>
            <span className="vertical-text">NEW GAME</span>
          </button>
        </h2>
      )}
      <div className="board-container">
        <Board board={board} />
      </div>
      {result && <p className="vertical-text">{result}</p>}
    </div>
  );
}

export default App;

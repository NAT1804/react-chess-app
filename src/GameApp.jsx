import { useEffect, useState } from "react";
import Board from "./Board";
import { gameSubject, initGame, resetGame } from "./Game";
import { useParams } from "react-router-dom";
import { db } from "./firebase";

const GameApp = () => {
  const [board, setBoard] = useState([]);
  const [isGameOver, setIsGameOver] = useState();
  const [result, setResult] = useState();
  const [position, setPosition] = useState();
  const [initResult, setInitResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(async () => {
    let subscribe;
    const init = async () => {
      const res = await initGame(id !== "local" ? db.doc(`games/${id}`) : null);
      setInitResult(res);
      setLoading(false);
      if (!res) {
        subscribe = gameSubject.subscribe((game) => {
          setBoard(game.board);
          setIsGameOver(game.isGameOver);
          setResult(game.result);
          setPosition(game.position);
        });
      }
    };

    init();

    return () => subscribe && subscribe.unsubscribe();
  }, [id]);

  if (loading) {
    return "Loading ...";
  }

  if (initResult === "notfound") {
    return "Game Not Found";
  }

  if (initResult === "intruder") {
    return "The game is already full";
  }

  return (
    <div className="app-container">
      {isGameOver && (
        <h2 className="vertical-text">
          GAME OVER
          <button onClick={resetGame}>
            <span className="vertical-text">NEW GAME</span>
          </button>
        </h2>
      )}
      {!isGameOver && (
        <button className="btn-new-game" onClick={resetGame}>
          <span className="vertical-text">RESET GAME</span>
        </button>
      )}
      <div className="board-container">
        <Board board={board} position={position} />
      </div>
      {result && <p className="vertical-text">{result}</p>}
    </div>
  );
};

export default GameApp;

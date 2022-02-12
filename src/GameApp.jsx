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
  const [status, setStatus] = useState("waiting");
  const { id } = useParams();
  const sharebleLink = window.location.href;

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
          setStatus(game.status);
        });
      }
    };

    init();

    return () => subscribe && subscribe.unsubscribe();
  }, [id]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(sharebleLink);
  };

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
      {result && <p className="vertical-text">{result}</p>}\
      {status === "waiting" && (
        <div className="notification is-link share-game">
          <strong>Share this game to continue</strong>
          <br />
          <br />
          <div className="field has-addons">
            <div className="control is-expanded">
              <input
                type="text"
                name=""
                id=""
                className="input"
                readOnly
                value={sharebleLink}
              />
            </div>
            <div className="control">
              <button className="button is-info" onClick={copyToClipboard}>
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameApp;

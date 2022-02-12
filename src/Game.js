import * as Chess from "chess.js";
import { BehaviorSubject } from "rxjs";

// let promotion = "rnb2bnr/pppPkppp/8/4p3/7q/8/PPPP1PPP/RNBQKBNR w KQ - 1 5";
// let staleMate = "4k3/4P3/4K3/8/8/8/8/8 b - - 0 78";
// let draw = "4k3/4P3/4K3/8/8/8/8/8 b - - 0 78";
// let checkMate = "rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3";
// let threefoldRepetition =
//   "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
// let insuficcientMaterial = "k7/8/n7/8/8/8/8/7K b - - 0 1";

const chess = new Chess();

export const gameSubject = new BehaviorSubject();

export const initGame = () => {
  updateGame();
};

export const resetGame = () => {
  chess.reset();
  updateGame();
};

export const handleMove = (from, to) => {
  const promotions = chess.moves({ verbose: true }).filter((m) => m.promotion);
  if (promotions.some((p) => `${p.from}:${p.to}` === `${from}:${to}`)) {
    const pendingPromotion = { from, to, color: promotions[0].color };
    updateGame(pendingPromotion);
  }
  const { pendingPromotion } = gameSubject.getValue();
  if (!pendingPromotion) {
    move(from, to);
  }
};

export const move = (from, to, promotion) => {
  let tempMove = { from, to };
  if (promotion) {
    tempMove.promotion = promotion;
  }

  const legalMove = chess.move(tempMove);
  if (legalMove) {
    updateGame();
  }
};

const updateGame = (pendingPromotion) => {
  const isGameOver = chess.game_over();
  const newGame = {
    board: chess.board(),
    pendingPromotion,
    isGameOver,
    turn: chess.turn(),
    result: isGameOver ? getGameResult() : null,
  };
  gameSubject.next(newGame);
};

const getGameResult = () => {
  if (chess.in_checkmate()) {
    const winner = chess.turn() === "w" ? "BLACK" : "WHITE";
    return `CHECKMATE - WINNER - ${winner}`;
  } else if (chess.in_draw()) {
    let reason = "50 - MOVES - RULE";
    if (chess.in_stalemate()) {
      reason = "STALEMATE";
    } else if (chess.in_threefold_repetition()) {
      reason = "REPETITION";
    } else if (chess.insuficcient_material()) {
      reason = "INSUFICCIENT MATERIAL";
    }

    return `DRAW - ${reason}`;
  } else {
    return "UNKNOWN REASON";
  }
};

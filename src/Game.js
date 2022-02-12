import * as Chess from "chess.js";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { auth } from "./firebase";
import { fromRef } from "rxfire/firestore";

let gameRef;
let member;

// let promotion = "rnb2bnr/pppPkppp/8/4p3/7q/8/PPPP1PPP/RNBQKBNR w KQ - 1 5";
// let staleMate = "4k3/4P3/4K3/8/8/8/8/8 b - - 0 78";
// let draw = "4k3/4P3/4K3/8/8/8/8/8 b - - 0 78";
// let checkMate = "rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3";
// let threefoldRepetition =
//   "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
// let insuficcientMaterial = "k7/8/n7/8/8/8/8/7K b - - 0 1";

const chess = new Chess();

export let gameSubject;

export const initGame = async (gameRefFirebase) => {
  const { currentUser } = auth;
  if (gameRefFirebase) {
    gameRef = gameRefFirebase;
    const initialGame = await gameRefFirebase.get().then((doc) => doc.data());
    if (!initialGame) {
      return "notfound";
    }
    const creator = initialGame.members.find((m) => m.creator === true);

    if (initialGame.status === "waiting" && creator.uid !== currentUser.uid) {
      const currUser = {
        uid: currentUser.uid,
        name: localStorage.getItem("userName"),
        piece: creator.piece === "w" ? "b" : "w",
      };
      const updateMembers = [...initialGame.members, currUser];
      await gameRefFirebase.update({ members: updateMembers, status: "ready" });
    } else if (
      !initialGame.members.map((m) => m.uid).includes(currentUser.uid)
    ) {
      return "intruder";
    }
    chess.reset();

    gameSubject = fromRef(gameRefFirebase).pipe(
      map((gameDoc) => {
        const game = gameDoc.data();
        const { pendingPromotion, gameData, ...restOfGame } = game;
        member = game.members.find((m) => m.uid === currentUser.uid);
        const openent = game.members.find((m) => m.uid !== currentUser.uid);

        if (gameData) {
          chess.load(gameData);
        }
        const isGameOver = chess.game_over();
        return {
          board: chess.board(),
          pendingPromotion,
          isGameOver,
          position: member.piece,
          member,
          openent,
          result: isGameOver ? getGameResult() : null,
          ...restOfGame,
        };
      })
    );
  } else {
    gameRef = null;
    gameSubject = new BehaviorSubject();
    const savedGame = localStorage.getItem("savedGame");
    if (savedGame) {
      chess.load(savedGame);
    }
    updateGame();
  }
};

export const resetGame = () => {
  chess.reset();
  updateGame();
};

export const handleMove = (from, to) => {
  const promotions = chess.moves({ verbose: true }).filter((m) => m.promotion);
  let pendingPromotion;
  if (promotions.some((p) => `${p.from}:${p.to}` === `${from}:${to}`)) {
    pendingPromotion = { from, to, color: promotions[0].color };
    updateGame(pendingPromotion);
  }
  if (!pendingPromotion) {
    move(from, to);
  }
};

export const move = (from, to, promotion) => {
  let tempMove = { from, to };
  if (promotion) {
    tempMove.promotion = promotion;
  }
  if (gameRef) {
    if (member.piece === chess.turn()) {
      const legalMove = chess.move(tempMove);
      if (legalMove) {
        updateGame();
      }
    }
  } else {
    const legalMove = chess.move(tempMove);
    if (legalMove) {
      updateGame();
    }
  }
};

const updateGame = async (pendingPromotion) => {
  const isGameOver = chess.game_over();

  if (gameRef) {
    const updateData = {
      gameData: chess.fen(),
      pendingPromotion: pendingPromotion || null,
    };
    await gameRef.update(updateData);
  } else {
    const newGame = {
      board: chess.board(),
      pendingPromotion,
      isGameOver,
      position: chess.turn(),
      result: isGameOver ? getGameResult() : null,
    };
    localStorage.setItem("savedGame", chess.fen());
    gameSubject.next(newGame);
  }
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

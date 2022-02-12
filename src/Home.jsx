import React, { useState } from "react";
import { auth, db } from "./firebase";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { currentUser } = auth;
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const newGameOptions = [
    { label: "Black piece", value: "b" },
    { label: "White piece", value: "w" },
    { label: "Random", value: "r" },
  ];
  const handlePlyOnline = () => {
    setShowModal(true);
  };
  const startOnlineGame = async (startingPiece) => {
    const member = {
      uid: currentUser.uid,
      piece:
        startingPiece === "random"
          ? ["b", "w"][Math.round(Math.random())]
          : startingPiece,
      name: localStorage.getItem("userName"),
      creator: true,
    };
    const game = {
      status: "waiting",
      members: [member],
      gameId: `${Math.random().toString(36).substring(2, 11)}_${Date.now()}`,
    };
    await db.collection("games").doc(game.gameId).set(game);
    navigate(`/game/${game.gameId}`);
  };
  return (
    <>
      <div className="columns home">
        <div className="column has-background-primary home-columns">
          <button className="button is-link">Play Locally</button>
        </div>
        <div className="column has-background-link home-columns">
          <button className="button is-primary" onClick={handlePlyOnline}>
            Play online
          </button>
        </div>
      </div>
      <div className={`modal ${showModal ? "is-active" : ""}`}>
        <div className="modal-background"></div>
        <div className="model-content">
          <div className="card">
            <div className="card-content">
              Please select the piece you want to start
            </div>
            <footer className="card-footer">
              {newGameOptions.map(({ label, value }) => {
                return (
                  <span
                    className="card-footer-item cursor-pointer"
                    key={value}
                    onClick={() => startOnlineGame(value)}
                  >
                    {label}
                  </span>
                );
              })}
            </footer>
          </div>
        </div>
        <button
          className="modal-close is-large"
          onClick={() => setShowModal(false)}
        ></button>
      </div>
    </>
  );
};

export default Home;

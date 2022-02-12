import React, { useState } from "react";
import { auth } from "./firebase";

const UserForm = () => {
  const [name, setName] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("userName", name);
    await auth.signInAnonymously();
  };
  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h1>Enter your name to start</h1>
      <br />
      <div className="field">
        <p className="control">
          <input
            type="text"
            name=""
            id=""
            className="input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </p>
      </div>
      <div className="field">
        <p className="control">
          <button className="button is-success" type="submit">
            Start
          </button>
        </p>
      </div>
    </form>
  );
};

export default UserForm;

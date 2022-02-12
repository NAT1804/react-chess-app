import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./Home";
import GameApp from "./GameApp";
import UserForm from "./UserForm";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

const App = () => {
  const [user, loading, error] = useAuthState(auth);
  if (loading) {
    return "Loading ...";
  }
  if (error) {
    return "There was an error";
  }
  if (!user) {
    return <UserForm />;
  }

  return "Success";
};

export default App;

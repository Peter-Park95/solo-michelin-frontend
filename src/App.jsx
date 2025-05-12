// src/App.jsx
import React from "react";
import HomePage from "./pages/HomePage.jsx";
import BottomTab from "./components/BottomTab.jsx";

function App() {
  return (
    <div className="AppWrapper">
      <div className="AppContainer">
        <HomePage />
        <BottomTab />
      </div>
    </div>
  );
}

export default App;

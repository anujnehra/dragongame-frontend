import React, { useState, useEffect } from "react";
import { AutheProvider } from "./contexts/AutheContext";
import Game from "./components/game/Game";
import Home from "./components/home/Home.jsx";
import { UserProvider } from "./contexts/UserContext";
import { GameProvider } from "./contexts/GameContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NotFound from "./components/NotFound";

function App() {
  let [theme, setTheme] = useState("light");

  const changeTheme = () => {
    setTheme("light");
  };

  useEffect(() => {
    let bodyElement = document.getElementsByTagName("body");

    bodyElement[0].className = theme;
  }, [theme]);

  return (
    <React.Fragment>
      <AutheProvider>
        <UserProvider>
          <GameProvider>
            <Router>
              <Switch>
                <Route exact path="/game">
                  <Game />
                </Route>

                <Route exact path={["/", "/login", "/signup"]}>
                  <Home />
                </Route>

                <Route path="*">
                  <NotFound className="page" />
                </Route>
              </Switch>
            </Router>
          </GameProvider>
        </UserProvider>
      </AutheProvider>
    </React.Fragment>
  );
}

export default App;

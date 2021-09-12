import React from "react";
import LinkBtn from "../LinkBtn";
import Button from "../Button";
import GameHistory from "./GameHistory";
import useUserHome from "../../hooks/useUserHome";
import Loader from "../Loader";

function UserHome() {
  let { game, user, fetchStatus, handelLogout, logoutLoader } = useUserHome();

  return (
    <React.Fragment>
      {!user ? (
        <Loader height={70} width={6} margin={4} />
      ) : (
        <div className="user-home">
          <div className="item item1">
            <h3>{`Welcome ` + user.name}</h3>
            <div>
              <LinkBtn to="/game" className="primary-btn">
                Start Game
              </LinkBtn>
              <Button
                className="primary-btn"
                onClick={handelLogout}
                loader={logoutLoader}
                disabled={logoutLoader}
              >
                Log out
              </Button>
            </div>
          </div>
          <div className="item item2">
            {fetchStatus.error === "ServerError" ? (
              <p>Some thing goes wrong, Game history not loaded</p>
            ) : (
              <GameHistory
                game={game ? game : []}
                loading={game ? false : true}
              />
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default UserHome;

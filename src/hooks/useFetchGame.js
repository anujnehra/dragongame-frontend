import { useEffect } from "react";
import { useGame } from "./game";
import { useAuthe } from "./authe";
import { useHistory } from "react-router-dom";
import { useUser } from "./user";

const useFetchGame = () => {
  let { user } = useUser();
  let { game, setGame } = useGame();
  let authe = useAuthe();
  let history = useHistory();

  useEffect(() => {
    (async () => {
      if (authe.login) {
        if (!game && user) {
          let res = await fetch("/auth/getuser.json", {
            method: "POST",
            crossDomain: false,
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: user.id,
            }),
          });
          if (res.status === 200) {
            let result = await res.json();

            if (result.response.statusCode == 200) {
              setGame(result.response.success.Game);

              authe.setAuthe(
                Buffer.from(result.response.success.User.email).toString(
                  "base64"
                )
              );
            }

            if (result.response.statusCode === 400) {
              authe.removeAuthe();
              history.push("/");
            }
          }
        }
      } else {
        authe.removeAuthe();
        history.push("/");
      }
    })();
  }, [user]);

  return {
    game,
    setGame,
  };
};

export default useFetchGame;

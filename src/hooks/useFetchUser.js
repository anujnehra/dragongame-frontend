import { useEffect } from "react";
import { useUser } from "./user";
import { useAuthe } from "./authe";
import { useHistory, useParams } from "react-router-dom";

let useFetchUser = (byParams = false, as = null) => {
  let authe = useAuthe();
  let { user, setUser } = useUser();
  let history = useHistory();
  let { username } = useParams();

  useEffect(() => {
    if (as === "guest") {
      setUser(null);
    } else if (authe.login) {
      if (!user) {
        (async () => {
          let un = byParams ? username : localStorage.getItem("username");

          let res = await fetch("/auth/getuser.json", {
            method: "POST",
            crossDomain: false,
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: `${un}`,
            }),
          });

          if (res.status === 200) {
            let result = await res.json();
            if (result.response.statusCode == 200) {
              setUser(result.response.success.User);

              authe.setAuthe(
                Buffer.from(result.response.success.User.email).toString(
                  "base64"
                )
              );
            }
            if (result.response.statusCode === 400) {
              authe.removeAuthe();
              history.push("/login");
            }
          }
        })();
      }
    } else {
      history.push("/login");
    }
  }, [user, as]);
  return {
    user,
    setUser,
  };
};

export default useFetchUser;

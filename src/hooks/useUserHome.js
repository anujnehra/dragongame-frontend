import { useState, useEffect } from "react";
import { useAuthe } from "./authe";
import useFetchUser from "./useFetchUser";
import useFetchGame from "./useFetchGame";

let useUserHome = () => {
  let [logoutLoader, setLogoutLoader] = useState(false);
  let [fetchStatus, setFetchStatus] = useState({
    error: "",
    success: "",
  });
  let authe = useAuthe();
  let { user } = useFetchUser();
  let { game } = useFetchGame();

  let handelLogout = async () => {
    setLogoutLoader(true);
    localStorage.clear();
  };

  useEffect(() => {
    const controller = new AbortController();

    let cancel = false;
    if (logoutLoader) {
      authe.removeAuthe();

      return () => {
        controller.abort();
        cancel = true;
      };
    }
  }, [logoutLoader]);

  return {
    game,
    authe,
    user,
    fetchStatus,
    handelLogout,
    logoutLoader,
  };
};

export default useUserHome;

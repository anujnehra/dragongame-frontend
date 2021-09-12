import React from "react";
import "../../style/Home.scss";
import Header from "../Header";
import UserHome from "./UserHome";
import LoginBox from "./LoginBox";
import SignupBox from "./SignupBox";
import { useLocation, Redirect } from "react-router-dom";
import { useAuthe } from "../../hooks/authe";

function Home() {
  let { pathname } = useLocation();
  let { login } = useAuthe();

  if (login && /(login)|(signup)/iu.test(pathname)) return <Redirect to="/" />;
  else
    return (
      <div className="page home-page">
        <Header />

        <main>
          {pathname === "/" && login && <UserHome />}

          {pathname === "/" && !login && <LoginBox />}

          {pathname === "/login" && <LoginBox />}

          {pathname === "/signup" && <SignupBox />}
        </main>
      </div>
    );
}

export default Home;

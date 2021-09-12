import React, { useReducer, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import loginReducer, { loginInitialState } from "../../reducer/loginReducer";
import { useAuthe } from "../../hooks/authe";
import Button from "../Button";
import Warning from "../Warning";
import Form, { FormInput } from "../Form";
import { useUser } from "../../hooks/user";

function LoginBox() {
  let [warn, setWarn] = useState(false);
  let [loader, setLoader] = useState(false);
  let authe = useAuthe();
  let history = useHistory();
  let { setUser } = useUser();

  let [loginInput, loginInputDispatch] = useReducer(
    loginReducer,
    loginInitialState
  );

  function handelSubmit(e) {
    e.preventDefault();
    setLoader(true);
  }

  function handelChange(e) {
    let value = e.target.value;

    loginInputDispatch({
      type: e.target.name,
      payload: {
        currentValue: value,
      },
    });

    warn && setWarn(false);
  }

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let cancel = false;
    if (loader) {
      (async function () {
        setWarn(false);
        let res = await fetch("/auth/login.json", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: loginInput.password,
            username: loginInput.username,
          }),
          signal,
        });

        if (!cancel) {
          if (res.status === 200) {
            let result = await res.json();

            if (result.response.statusCode === 400) {
              setLoader(false);
              setWarn(true);
            }

            if (result.response.statusCode === 200) {
              setUser(result.response.success.User);
              authe.setAuthe(
                Buffer.from(result.response.success.User.email).toString(
                  "base64"
                )
              );
              history.push();
            }
          }
        }
      })();

      return () => {
        controller.abort();
        cancel = true;
      };
    }
  }, [loader]);

  return (
    <div className="login-home">
      <div className="authe-form">
        <Warning warn={warn}>Username or Password Incorrect</Warning>

        <Form onSubmit={handelSubmit}>
          <FormInput
            type="text"
            id="userId"
            name="username"
            placeholder="Username"
            onChange={handelChange}
            value={loginInput.username}
            required={true}
          />
          <FormInput
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            onChange={handelChange}
            value={loginInput.password}
          />
          <Button
            type="submit"
            className="secondary-btn submit-btn"
            loader={loader}
          >
            Log In
          </Button>
        </Form>

        <div className="other-link">
          <Link to="/signup">Create New Account</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginBox;

import React, { useState, useReducer, useEffect } from "react";
import Button from "../Button";
import { Link, useHistory } from "react-router-dom";
import Warning from "../Warning";
import signupReducer, { signupInitialState } from "../../reducer/signupReducer";
import Form, { FormInput } from "../Form";
import { useUser } from "../../hooks/user";
import { useAuthe } from "../../hooks/authe";

function SignupBox() {
  let [warn, setWarn] = useState({
    status: false,
    message: "Fill the Sign Up From",
  });
  let [loader, setLoader] = useState(false);
  let history = useHistory();
  let [signupInput, signupInputDispatch] = useReducer(
    signupReducer,
    signupInitialState
  );
  let { setUser } = useUser();
  let authe = useAuthe();

  function handelSubmit(e) {
    e.preventDefault();
    setLoader(true);
    setWarn({
      status: false,
      message: "Fill Sign Up From",
    });
  }

  function handelChange(e) {
    let value = e.target.value;

    if (e.target.name === "password") {
      value.length < 7 &&
        setWarn({
          status: true,
          message: "Password must be min 8 characters long",
        });
      value.length > 7 &&
        warn.status &&
        setWarn({
          status: false,
          message: "Fill the signup form",
        });
    }

    signupInputDispatch({
      type: e.target.name,
      payload: {
        currentValue: value,
      },
    });

    !/(password)/.test(e.target.name) &&
      warn.status &&
      setWarn({
        status: false,
        message: "Fill Sign Up From",
      });
  }

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let cancel = false;
    if (loader) {
      (async function () {
        let res = await fetch("/auth/register.json", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: signupInput.name,
            email: signupInput.email,
            password: signupInput.password,
          }),
          signal,
        });

        if (!cancel) {
          if (res.status === 200) {
            let result = await res.json();

            if (result.response.statusCode === 400) {
              setLoader(false);
              setWarn({
                status: true,
                message: "email already register",
              });
            } else {
              setUser(result.response.success.user);
              authe.setAuthe(
                Buffer.from(result.response.success.user.email).toString(
                  "base64"
                )
              );
              history.push("/");
              return;
            }
          }
        }
      })();
    }

    return () => {
      controller.abort();
      cancel = true;
    };
  }, [loader]);

  return (
    <div className="signup-home">
      <div className="authe-form">
        <Warning warn={warn.status}>{warn.message}</Warning>
        <Form className="form" onSubmit={handelSubmit}>
          <FormInput
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={signupInput.name}
            onChange={handelChange}
            required
          />

          <FormInput
            type="text"
            id="email"
            name="email"
            placeholder="Email address"
            value={signupInput.email}
            onChange={handelChange}
            required
          />

          <FormInput
            type="password"
            id="password"
            name="password"
            placeholder="New password"
            value={signupInput.password}
            onChange={handelChange}
            required
          />
          <Button
            className="secondary-btn submit-btn"
            type="submit"
            loader={loader}
          >
            Sign Up
          </Button>
        </Form>

        <div className="other-link">
          <Link to="login">Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default SignupBox;

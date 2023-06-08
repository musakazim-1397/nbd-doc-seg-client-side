import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Auth.module.css";

const rootUrl = "https://nbd-document-segmenter.onrender.com/" || "http://localhost:5000/";

const Auth = () => {
  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [wantToLogin, setWantToLogin] = useState(false);
  const navigate = useNavigate();

  const formSubmitHandler = (event) => {
    event.preventDefault();

    !wantToLogin
      ? fetch(`${rootUrl}api/register`, {
          method: "POST",
          body: JSON.stringify({
            name: nameInputRef.current.value,
            email: emailInputRef.current.value,
            password: passwordInputRef.current.value,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              navigate("/", { replace: true });
              throw new Error("error", response.status);
            }
          })
          .then((data) => {
            console.log(data);
            localStorage.setItem("doc-user", JSON.stringify(data));
            navigate("/home", { replace: true });
          })
          .catch((error) => {
            console.log(error);
          })
      : fetch(`${rootUrl}api/login`, {
          method: "POST",
          body: JSON.stringify({
            email: emailInputRef.current.value,
            password: passwordInputRef.current.value,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              navigate("/", { replace: true });
              throw new Error("error", response.status);
            }
          })
          .then((data) => {
            console.log(data);
            localStorage.setItem("doc-user", JSON.stringify(data));
            navigate("/home", { replace: true });
          })
          .catch((error) => {
            console.log(error);
          });
  };

  return (
    <div className={classes.container}>
      <form onSubmit={formSubmitHandler} className={classes.form}>
        {!wantToLogin && (
          <div style={{marginBottom:'8px'}}>
            <label htmlFor="name">your name</label>
            <input
              type="text"
              id="name"
              name="name"
              ref={nameInputRef}
              className={classes.input}
              style={{ marginLeft: "32px" }}
            />
          </div>
        )}
        <div style={{marginBottom:'8px'}}>
          <label htmlFor="email">your email</label>
          <input
            type="text"
            id="email"
            name="email"
            ref={emailInputRef}
            className={classes.input}
            style={{ marginLeft: "33px" }}
          />
        </div>
        <div >
          <label htmlFor="password">your password</label>
          <input
            type="password"
            id="password"
            name="password"
            className={classes.input}
            ref={passwordInputRef}
            style={{ marginLeft: "5px" }}
          />
        </div>
        <button type="submit" className={classes.btn}>
          {!wantToLogin ? "Register" : "login"}
        </button>
        <button
          type="button"
          onClick={() => setWantToLogin(!wantToLogin)}
          className={classes.registerButton}
        >
          {!wantToLogin
            ? "Already have account? Login"
            : "No Account? Register"}
        </button>
      </form>
    </div>
  );
};

export default Auth;

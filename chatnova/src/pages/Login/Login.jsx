import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";
import { signup, login, resetPass } from "../../config/Firebase";
const Login = () => {
  const [currState, setCurrState] = useState("Sign Up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (currState === "Sign Up") {
      signup(userName, email, password);
    } else {
      login(email, password);
    }
  };
  return (
    <div className="login">
      <img src={assets.logo_big} alt="" className="logo" />
      <form className="login-form" onSubmit={onSubmitHandler}>
        <h2>{currState}</h2>
        {currState === "Sign Up" ? (
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            type="text"
            placeholder="username"
            className="form-input"
            required
          />
        ) : null}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email Address"
          className="form-input"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="password"
          className="form-input"
          required
        />
        <button type="submit">
          {currState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>
        <div className="login-forgot">
          {currState === "Sign Up" ? (
            <p className="login-toggle">
              Already have an Account?{" "}
              <span onClick={() => setCurrState("Login")}>Login here</span>
            </p>
          ) : (
            <p className="login-toggle">
              Create an account?{" "}
              <span onClick={() => setCurrState("Sign Up")}>click here</span>
            </p>
          )}
          {currState === "Login" ? (
            <p className="login-toggle">
              Forgot Password?{" "}
              <span onClick={() => resetPass(email)}>reset here</span>
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default Login;

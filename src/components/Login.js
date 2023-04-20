import React, { useState } from "react";

// redux
import { useSelector, useDispatch } from "react-redux";
import Notification from "./Notification";

// login reducer actions
import { login } from "../reducers/loginReducer";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const notification = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(login(username, password));
  };

  return (
    <>
      <h3>login to application</h3>
      <Notification notification={notification} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            name="Username"
            value={username}
            id="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            name="Password"
            value={password}
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button id="login-button">login</button>
      </form>
    </>
  );
};

export default Login;

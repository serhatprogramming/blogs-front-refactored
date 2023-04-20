import { useState, useEffect, useRef } from "react";
//components
import Login from "./components/Login";
import Blogs from "./components/Blogs";

// login reducer actions
import { loginLocalStorage } from "./reducers/loginReducer";
// redux
import { useSelector, useDispatch } from "react-redux";

const App = () => {
  const blogFormRef = useRef();

  //======================================================//
  // redux store
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  //======================================================//
  useEffect(() => {
    const userLocalStorage = JSON.parse(
      window.localStorage.getItem("loggedBlogUser")
    );
    if (userLocalStorage) {
      dispatch(loginLocalStorage(userLocalStorage));
    }
  }, []);

  return <>{user ? <Blogs /> : <Login />}</>;
};

export default App;

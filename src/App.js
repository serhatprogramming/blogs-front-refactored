import { useState, useEffect, useRef } from "react";
//components
import Login from "./components/Login";
import Blogs from "./components/Blogs";

// login reducer actions
import { loginLocalStorage } from "./reducers/loginReducer";
// redux
import { useSelector, useDispatch } from "react-redux";

const App = () => {
  //======================================================//
  // redux store
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  //======================================================//
  // initial user and trigger loading the blogs
  useEffect(() => {
    const userLocalStorage = JSON.parse(
      window.localStorage.getItem("loggedBlogUser")
    );
    if (userLocalStorage) {
      dispatch(loginLocalStorage(userLocalStorage));
    }
  }, []);

  // final return of the APP
  return <>{user ? <Blogs /> : <Login />}</>;
};

export default App;

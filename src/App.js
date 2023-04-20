import { useState, useEffect, useRef } from "react";
//components
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
//services
import loginService from "./services/login";
// notification reducer actions
import {
  addInfoNotification,
  addWarningNotification,
  removeNotification,
} from "./reducers/notificationReducer";
// blog reducer actions
import { initializeBlogs, createBlog } from "./reducers/blogReducer";
// redux
import { useSelector, useDispatch } from "react-redux";

const App = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);

  const blogFormRef = useRef();

  //======================================================//
  // redux store
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notifications);
  const blogs = useSelector((state) => state.blogs);
  //======================================================//
  useEffect(() => {
    const userLocalStorage = JSON.parse(
      window.localStorage.getItem("loggedBlogUser")
    );
    if (userLocalStorage) {
      setUser(userLocalStorage);
      const returnedToken = loginService.setToken(userLocalStorage.token);
      setToken(returnedToken);
      dispatch(initializeBlogs(returnedToken));
    }
  }, []);

  //======================================================//
  const showLogin = () => (
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
  //======================================================//

  const showBlogs = () => (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {`${user.username} is logged in`}{" "}
        <button onClick={handleLogout}>logout</button>{" "}
      </p>
      {createNewBlog()}
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            token={token}
            username={user.username}
          />
        ))}
    </div>
  );
  //======================================================//

  const handleCreateBlog = async ({ title, author, url }) => {
    blogFormRef.current.toggleVisible();
    const newBlog = {
      title,
      author,
      url,
      user: user.id,
    };
    dispatch(createBlog(newBlog, token));
  };
  //======================================================//

  const createNewBlog = () => (
    <Togglable buttonLabel="new note" ref={blogFormRef}>
      <BlogForm handleCreateBlog={handleCreateBlog} />
    </Togglable>
  );
  //======================================================//

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loggedUser = await loginService.login(username, password);
      setUser(loggedUser);
      const returnedToken = loginService.setToken(loggedUser.token);
      setToken(returnedToken);
      dispatch(initializeBlogs(returnedToken));
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(loggedUser));
    } catch (error) {
      dispatch(addWarningNotification("Wrong Credentials"));
      setTimeout(() => {
        dispatch(removeNotification());
      }, 1000);
    }
  };
  //======================================================//

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };
  //======================================================//

  return <>{user ? showBlogs() : showLogin()}</>;
};

export default App;

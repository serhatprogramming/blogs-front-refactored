import { useState, useEffect, useRef } from "react";
//components
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
//services
import blogService from "./services/blogs";
import loginService from "./services/login";
// notification reducer actions
import {
  addInfoNotification,
  addWarningNotification,
  removeNotification,
} from "./reducers/notificationReducer";
// blog reducer actions
import { initializeBlogs } from "./reducers/blogReducer";
// redux
import { useSelector, useDispatch } from "react-redux";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);

  const blogFormRef = useRef();

  //======================================================//
  // redux store
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notifications);
  const blogsComingReduxStore = useSelector((state) => state.blogs);
  //======================================================//
  useEffect(() => {
    const userLocalStorage = JSON.parse(
      window.localStorage.getItem("loggedBlogUser")
    );
    if (userLocalStorage) {
      setUser(userLocalStorage);
      const returnedToken = loginService.setToken(userLocalStorage.token);
      setToken(returnedToken);
      blogService.getAll(returnedToken).then((blogs) => setBlogs(blogs));
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
      {[...blogsComingReduxStore]
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
    let message = "";
    const response = await blogService.createNew(newBlog, token);
    if (response === "Request failed with status code 400") {
      message = {
        content: `Fill out all the fields.`,
        style: "error",
      };
    } else {
      message = {
        content: `a new blog ${newBlog.title}! by ${newBlog.author} added`,
        style: "info",
      };
      const returnedBlogs = await blogService.getAll(token);
      setBlogs(returnedBlogs);
    }
    showNotification(message);
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
      const returnedBlogs = await blogService.getAll(returnedToken);
      setBlogs(returnedBlogs);
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(loggedUser));
    } catch (error) {
      const message = {
        content: `Wrong Credentials.`,
        style: "error",
      };
      showNotification(message);
    }
  };
  //======================================================//

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };
  //======================================================//

  const showNotification = ({ content, style }) => {
    if (style === "info") {
      dispatch(addInfoNotification(content));
    } else if (style === "error") {
      dispatch(addWarningNotification(content));
    }
    setTimeout(() => {
      dispatch(removeNotification());
    }, 1000);
  };
  //======================================================//

  return <>{user ? showBlogs() : showLogin()}</>;
};

export default App;

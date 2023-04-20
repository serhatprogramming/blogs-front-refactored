import React, { useRef } from "react";
// redux
import { useSelector, useDispatch } from "react-redux";
// blog reducer actions
import { createBlog } from "../reducers/blogReducer";
// login reducer actions
import { setUser } from "../reducers/loginReducer";
// components
import Notification from "./Notification";
import Togglable from "./Togglable";
import Blog from "./Blog";
import BlogForm from "./BlogForm";

const Blogs = () => {
  const blogFormRef = useRef();
  //======================================================//
  // redux store
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notifications);
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    window.localStorage.clear();
    dispatch(setUser(null));
  };

  const createNewBlog = () => (
    <Togglable buttonLabel="new note" ref={blogFormRef}>
      <BlogForm handleCreateBlog={handleCreateBlog} />
    </Togglable>
  );

  const handleCreateBlog = async ({ title, author, url }) => {
    blogFormRef.current.toggleVisible();
    const newBlog = {
      title,
      author,
      url,
      user: user.id,
    };
    dispatch(createBlog(newBlog, user.returnedToken));
  };

  return (
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
            token={user.returnedToken}
            username={user.username}
          />
        ))}
    </div>
  );
};

export default Blogs;

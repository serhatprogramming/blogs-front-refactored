import { useState } from "react";

// blog reducer actions
import { updateBlog, eraseBlog } from "../reducers/blogReducer";
// redux
import { useDispatch } from "react-redux";

const Blog = ({ blog, token, username }) => {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleShow = () => setShow(!show);

  const increaseLike = async () => {
    dispatch(updateBlog(blog, token));
  };

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(eraseBlog(blog, token));
    }
  };

  return (
    <div style={blogStyle} className="blogContent">
      {blog.title} {blog.author}{" "}
      <button onClick={toggleShow}>{show ? "hide" : "view"}</button>
      {show && (
        <>
          <br />
          {blog.url}
          <br />
          likes {blog.likes} <button onClick={increaseLike}>like</button>
          <br />
          {blog.user.username}
          <br />
          {blog.user.username === username && (
            <button onClick={removeBlog}>remove</button>
          )}
        </>
      )}
    </div>
  );
};

export default Blog;

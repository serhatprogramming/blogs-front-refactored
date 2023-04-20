import { createSlice } from "@reduxjs/toolkit";
//services
import blogService from "../services/blogs";
// notification reducer actions
import {
  addInfoNotification,
  addWarningNotification,
  removeNotification,
} from "../reducers/notificationReducer";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    updateBlogs(state, action) {
      return state.map((blog) =>
        blog.id === action.payload.id
          ? { ...blog, likes: blog.likes + 1 }
          : blog
      );
    },
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },
  },
});

export const { setBlogs, appendBlog, updateBlogs, removeBlog } =
  blogSlice.actions;

export const initializeBlogs = (token) => {
  return async (dispatch) => {
    const blogs = await blogService.getAll(token);
    dispatch(setBlogs(blogs));
  };
};

export const updateBlog = (blog, token) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.updateBlog(
      { ...blog, likes: blog.likes + 1 },
      token
    );

    dispatch(updateBlogs(updatedBlog.data));
  };
};

export const eraseBlog = (blog, token) => {
  return async (dispatch) => {
    const removedBlog = await blogService.deleteBlog(blog, token);
    dispatch(removeBlog(blog.id));
    dispatch(addWarningNotification(`${blog.title} is removed.`));
    setTimeout(() => {
      dispatch(removeNotification());
    }, 1000);
  };
};

export const createBlog = (blog, token) => {
  return async (dispatch) => {
    const newBlog = await blogService.createNew(blog, token);

    if (newBlog === "Request failed with status code 400") {
      dispatch(addWarningNotification(`Fill out all the fields.`));
    } else {
      dispatch(
        addInfoNotification(
          `a new blog ${newBlog.data.title}! by ${newBlog.data.author} added`
        )
      );
      dispatch(initializeBlogs(token));
    }
    setTimeout(() => {
      dispatch(removeNotification());
    }, 1000);
  };
};

export default blogSlice.reducer;

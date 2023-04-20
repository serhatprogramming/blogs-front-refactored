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
  },
});

export const { setBlogs, appendBlog } = blogSlice.actions;

export const initializeBlogs = (token) => {
  return async (dispatch) => {
    const blogs = await blogService.getAll(token);
    dispatch(setBlogs(blogs));
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
      dispatch(appendBlog(newBlog.data));
    }
    setTimeout(() => {
      dispatch(removeNotification());
    }, 1000);
  };
};

export default blogSlice.reducer;

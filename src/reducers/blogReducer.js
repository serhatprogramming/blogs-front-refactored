import { createSlice } from "@reduxjs/toolkit";
//services
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
  },
});

export const { setBlogs } = blogSlice.actions;

export const initializeBlogs = (token) => {
  return async (dispatch) => {
    const blogs = await blogService.getAll(token);
    dispatch(setBlogs(blogs));
  };
};

export default blogSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
//services
import loginService from "../services/login";
// blog reducer actions
import { initializeBlogs } from "./blogReducer";
// notification reducer actions
import {
  addWarningNotification,
  removeNotification,
} from "../reducers/notificationReducer";

const loginSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
  },
});

export const { setUser } = loginSlice.actions;

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const loggedUser = await loginService.login(username, password);
      const returnedToken = loginService.setToken(loggedUser.token);
      dispatch(initializeBlogs(returnedToken));
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(loggedUser));
      dispatch(setUser({ ...loggedUser, returnedToken }));
    } catch (error) {
      dispatch(addWarningNotification("Wrong Credentials"));
      setTimeout(() => {
        dispatch(removeNotification());
      }, 1000);
    }
  };
};

export const loginLocalStorage = (userLocalStorage) => {
  return async (dispatch) => {
    const returnedToken = loginService.setToken(userLocalStorage.token);
    dispatch(initializeBlogs(returnedToken));
    dispatch(setUser({ ...userLocalStorage, returnedToken }));
  };
};

export default loginSlice.reducer;

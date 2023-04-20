import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
// reducers
import notificationReducer from "./reducers/notificationReducer";
import blogReducer from "./reducers/blogReducer";
// store
const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    blogs: blogReducer,
  },
});
// App within the Provider
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);

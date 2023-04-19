import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: null,
  reducers: {
    addInfoNotification(state, action) {
      const notification = action.payload;
      return { notification, style: "info" };
    },
    addWarningNotification(state, action) {
      const notification = action.payload;
      return { notification, style: "warning" };
    },
    removeNotification(state, action) {
      return null;
    },
  },
});

export const {
  addInfoNotification,
  addWarningNotification,
  removeNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;

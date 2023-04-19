import React from "react";

import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notifications);

  const info = {
    color: "green",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  const error = { ...info, color: "red" };

  return (
    <>
      {notification ? (
        <div style={notification.style === "info" ? info : error}>
          {notification.notification}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Notification;

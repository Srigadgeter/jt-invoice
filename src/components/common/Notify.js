import React from "react";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import { useDispatch, useSelector } from "react-redux";

import { removeNotification } from "store/slices/notificationsSlice";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />; // Slide notification from right to left
}

const Notify = () => {
  const notifications = useSelector((state) => state?.notifications);

  const dispatch = useDispatch();

  const handleClose = (id) => (_, reason) => {
    if (reason === "clickaway") return;
    dispatch(removeNotification(id));
  };

  return notifications?.map((notification, index) => {
    const { id, message, timeInSec = 5, variant = "error" } = notification;

    return (
      <Snackbar
        key={id}
        open={!!message}
        autoHideDuration={timeInSec * 1000}
        TransitionComponent={SlideTransition}
        onClose={handleClose(notification.id)}
        sx={{
          top: `${(index + 1) * 50}px !important` // Adjust the offset based on index to stack them
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity={variant} variant="filled" onClose={handleClose(notification.id)}>
          {message}
        </Alert>
      </Snackbar>
    );
  });
};

export default Notify;

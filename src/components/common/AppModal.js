import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

const styles = {
  modal: {
    top: "50%",
    width: 800,
    left: "50%",
    boxShadow: 10,
    minHeight: 300,
    border: "unset",
    outline: "none",
    borderRadius: "25px",
    position: "absolute",
    bgcolor: "background.paper",
    transform: "translate(-50%, -50%)"
  },
  header: {
    p: 4
  },
  content: {
    px: 4
  },
  footer: {
    p: 4
  }
};

const AppModal = ({ open, title, handleClose, children, footer, modalStyle = {}, ...props }) => {
  const ariaData = title?.toLowerCase()?.replace(/\s+/g, "-");

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby={`modal-${ariaData}-title`}
      aria-describedby={`modal-${ariaData}-description`}
      {...props}>
      <Box sx={[styles.modal, modalStyle]}>
        <Box sx={styles.header}>
          <Typography variant="h5">{title}</Typography>
        </Box>
        <Box sx={styles.content}>{children}</Box>
        {footer && <Box sx={styles.footer}>{footer}</Box>}
      </Box>
    </Modal>
  );
};

export default AppModal;

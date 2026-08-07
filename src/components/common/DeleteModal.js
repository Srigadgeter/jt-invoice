import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

import AppModal from "components/common/AppModal";
import useBreakpoints from "hooks/useBreakpoints";

const DeleteModal = ({
  open,
  handleClose,
  title = "Confirm Delete",
  description,
  handleDelete,
  isLoading = false
}) => {
  const { isMobile } = useBreakpoints();

  const footerContent = () => (
    <Stack direction="row" justifyContent="flex-end" alignItems="center">
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          startIcon={<CloseIcon />}
          onClick={handleClose}
          disabled={isLoading}
          size={isMobile ? "small" : "medium"}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          disabled={isLoading}
          size={isMobile ? "small" : "medium"}>
          Delete
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <AppModal
      open={open}
      title={title}
      footer={footerContent()}
      handleClose={handleClose}
      modalStyle={{ width: { xs: "90%", sm: "65%", md: "fit-content" }, minHeight: "fit-content" }}>
      {description}
    </AppModal>
  );
};

export default DeleteModal;

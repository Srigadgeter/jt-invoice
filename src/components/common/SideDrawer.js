import React from "react";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

import Logo from "assets/svg/logo.svg";

const styles = {
  companyName: {
    pt: 1,
    fontSize: 20,
    fontWeight: 700
  },
  listItem: {
    width: 250
  },
  listButton: {
    px: 3,
    gap: 3
  },
  listIcon: {
    minWidth: "fit-content"
  }
};

const SideDrawer = ({ list, handleClose, anchor = "left", open = false }) => {
  const navigate = useNavigate();

  return (
    <Drawer anchor={anchor} open={open} onClose={handleClose}>
      <Stack gap={2} p={2}>
        <Stack gap={2} direction="row">
          <Avatar
            src={Logo}
            variant="square"
            alt={process.env.REACT_APP_INVOICE_TEMPLATE_COMPANY_NAME_SHORT_FORM}
          />
          <Typography sx={styles.companyName}>Jayanthi Tex</Typography>
        </Stack>
        <Divider />
      </Stack>
      {list.map((item) => (
        <ListItem sx={styles.listItem} key={item?.key} disablePadding>
          <ListItemButton
            sx={styles.listButton}
            onClick={() => {
              handleClose();
              // setTimeout to avoid flickering since the routes are loaded lazily
              setTimeout(() => {
                navigate(item?.page?.to());
              }, 500);
            }}>
            <ListItemIcon sx={styles.listIcon}>{item?.icon}</ListItemIcon>
            <ListItemText primary={item?.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </Drawer>
  );
};

export default SideDrawer;

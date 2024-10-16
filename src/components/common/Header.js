import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import { signOut } from "firebase/auth";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useDispatch, useSelector } from "react-redux";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { auth } from "integrations/firebase";
import { isEveningNow } from "utils/utilites";
import { clearAllStoreData } from "utils/fetchUtils";
import { DEFAULT_DARK, DEFAULT_LIGHT } from "utils/constants";
import { setTheme, toggleTheme } from "store/slices/appSlice";

import Logo from "assets/svg/logo.svg";

const styles = {
  header: {
    pl: 2,
    pr: 3,
    top: 0,
    zIndex: 3,
    display: "flex",
    position: "sticky",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: (theme) =>
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.1) 0px 4px 12px"
        : "rgba(0, 0, 0, 0.1) 0px 4px 12px",
    bgcolor: (theme) =>
      theme.palette.mode === "dark" ? theme.palette.background.custom : theme.palette.common.white
  },
  themeSwitch: { m: 1 },
  avatar: {
    bgcolor: "primary.main",
    width: 34,
    height: 34
  },
  menu: {
    mt: 1.2
  }
};

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be"
      }
    }
  },
  "& .MuiSwitch-thumb": {
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.common.pink,
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`
    }
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2
  }
}));

const Header = ({ setOpenDrawer }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const { appTheme } = useSelector((state) => state?.app);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    localStorage.clear();
    clearAllStoreData(dispatch);
  };

  useEffect(() => {
    dispatch(setTheme(isEveningNow() ? DEFAULT_DARK : DEFAULT_LIGHT));
  }, []);

  const open = Boolean(anchorEl);

  return (
    <Box sx={styles.header}>
      <Stack direction="row" alignItems="center">
        <IconButton size="large" aria-label="Sidedrawer" onClick={() => setOpenDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <Avatar
          src={Logo}
          variant="square"
          alt={process.env.REACT_APP_INVOICE_TEMPLATE_COMPANY_NAME_SHORT_FORM}
        />
      </Stack>
      <Stack direction="row" alignItems="center">
        <MaterialUISwitch
          sx={styles.themeSwitch}
          onChange={() => {
            dispatch(toggleTheme());
          }}
          checked={appTheme === DEFAULT_DARK}
        />
        <Avatar
          sx={styles.avatar}
          aria-haspopup="true"
          onClick={handleClick}
          aria-expanded={open ? "true" : undefined}
          aria-controls={open ? "basic-menu" : undefined}>
          {process.env.REACT_APP_INVOICE_TEMPLATE_COMPANY_NAME_SHORT_FORM}
        </Avatar>

        <Menu
          id="menu"
          open={open}
          sx={styles.menu}
          anchorEl={anchorEl}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button"
          }}>
          <MenuItem onClick={handleSignOut}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sign out</ListItemText>
          </MenuItem>
        </Menu>
      </Stack>
    </Box>
  );
};

export default Header;

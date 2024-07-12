// Reusable MUI custom styles
const commonStyles = {
  // Select Dropdown
  selectDropdownMenuStyle: {
    ".MuiMenu-list": {
      overflowX: "hidden",
      overflowY: "overlay",
      maxHeight: 200,
      scrollbarWidth: "7px",
      ":hover": {
        "::-webkit-scrollbar": {
          display: "block"
        }
      }
    }
  },
  selectDropdownNoneMenuItem: (theme) => ({
    color: theme.palette.grey[500]
  }),
  selectDropdownNewMenuItem: {
    color: "primary.main"
  }
};

export default commonStyles;

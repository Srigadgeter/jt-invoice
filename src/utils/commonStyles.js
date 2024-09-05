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
  },
  dataGrid: {
    mt: 1,
    ".MuiDataGrid-columnHeaderTitle": {
      fontWeight: 600
    },
    ".MuiDataGrid-virtualScroller": {
      overflowX: "hidden",
      height: "calc(100vh - 370px)",
      scrollbarWidth: "7px",
      ":hover": {
        "::-webkit-scrollbar": {
          display: "block"
        }
      }
    }
  },
  dataGridHeader: {
    ".MuiDataGrid-columnHeaderTitle": {
      fontWeight: 600
    }
  }
};

export default commonStyles;

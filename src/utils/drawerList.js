import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import routes from "routes/routes";

const { HOME, INVOICES, PRODUCTS, CUSTOMERS } = routes;

export const drawerList = [
  {
    key: "dashboard",
    icon: <DashboardIcon />,
    label: "Dashboard",
    page: HOME
  },
  {
    key: "invoices",
    icon: <ReceiptLongIcon />,
    label: "Invoices",
    page: INVOICES
  },
  {
    key: "products",
    icon: <ShoppingBagIcon />,
    label: "Products",
    page: PRODUCTS
  },
  {
    key: "customers",
    icon: <PersonIcon />,
    label: "Customers",
    page: CUSTOMERS
  }
];

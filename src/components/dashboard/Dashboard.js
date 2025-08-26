/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import { getFY } from "utils/utilites";

import SalesStats from "./SalesStats";
import TopThreeStats from "./TopThreeStats";

const styles = {
  box: {
    p: 3,
    gap: "20px",
    flexGrow: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 50px)",
    bgcolor: (theme) =>
      theme.palette.mode === "dark" ? theme.palette.background.custom : theme.palette.grey[50]
  }
};

const Dashboard = () => {
  const [currentMonthSales, setCurrentMonthSales] = useState(0);
  const [currentFySales, setCurrentFySales] = useState(0);
  const [currentFyCustomersSalesInDescOrder, setCurrentFyCustomersSalesInDescOrder] = useState([]);
  const [currentFyTopCustomers, setCurrentFyTopCustomers] = useState([]);
  const [currentFyProductsSalesInDescOrder, setCurrentFyProductsSalesInDescOrder] = useState([]);
  const [currentFyTopProducts, setCurrentFyTopProducts] = useState([]);

  const { invoices } = useSelector((state) => state.invoices);
  const { startYear: currentStartYear, endYear: currentEndYear, month: currentMonth } = getFY();

  useEffect(() => {
    let thisMonthSales = 0;
    let thisFySales = 0;
    const thisFyCustomers = new Map();
    let thisFyCustomersSalesInDescOrder = [];
    let thisFyTopCustomers = [];
    const thisFyProducts = new Map();
    let thisFyProductsSalesInDescOrder = [];
    let thisFyTopProducts = [];

    if (invoices.length > 0) {
      invoices.forEach((invoice) => {
        const invoiceDate = dayjs(invoice.createdAt);
        const monthOfInvoice = invoiceDate.format("M");

        if (currentStartYear === invoice.startYear && currentEndYear === invoice.endYear) {
          thisFySales += invoice.totalAmount;
          if (monthOfInvoice === currentMonth) thisMonthSales += invoice.totalAmount;

          thisFyCustomers.set(invoice.customer.id, {
            id: invoice.customer.id,
            name: invoice.customer.name.label,
            count: (thisFyCustomers.get(invoice.customer.id)?.count ?? 0) + 1,
            amount: invoice.totalAmount + (thisFyCustomers.get(invoice.customer.id)?.amount ?? 0)
          });

          invoice.products.forEach((product) => {
            thisFyProducts.set(product.productName.id, {
              id: product.productName.id,
              name: product.productName.label,
              count:
                (thisFyProducts.get(product.productName.id)?.count ?? 0) +
                product.productQuantityPieces,
              amount:
                product.productAmountInclGST +
                (thisFyProducts.get(product.productName.id)?.amount ?? 0)
            });
          });
        }
      });

      thisFyCustomersSalesInDescOrder = Array.from(thisFyCustomers.values()).sort(
        (a, b) => b.amount - a.amount
      );

      thisFyTopCustomers = thisFyCustomersSalesInDescOrder.slice(0, 3);

      thisFyProductsSalesInDescOrder = Array.from(thisFyProducts.values()).sort(
        (a, b) => b.count - a.count
      );

      thisFyTopProducts = thisFyProductsSalesInDescOrder.slice(0, 3);
    }

    setCurrentFySales(thisFySales);
    setCurrentMonthSales(thisMonthSales);
    setCurrentFyCustomersSalesInDescOrder(thisFyCustomersSalesInDescOrder);
    setCurrentFyTopCustomers(thisFyTopCustomers);
    setCurrentFyProductsSalesInDescOrder(thisFyProductsSalesInDescOrder);
    setCurrentFyTopProducts(thisFyTopProducts);
  }, [invoices]);

  return (
    <Box sx={styles.box}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={4}>
          <SalesStats currentMonthSales={currentMonthSales} currentFySales={currentFySales} />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <TopThreeStats
            title="Customers"
            icon={<PersonIcon />}
            avatarBgColor="warning.main"
            list={currentFyTopCustomers}
            showAmount
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <TopThreeStats
            title="Products"
            icon={<ShoppingBagIcon />}
            avatarBgColor="secondary.main"
            list={currentFyTopProducts}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

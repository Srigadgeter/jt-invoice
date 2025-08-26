/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import { fyMonths } from "utils/constants";
import { getFY, indianCurrencyFormatter } from "utils/utilites";

import SalesStats from "./SalesStats";
import TopThreeStats from "./TopThreeStats";

const styles = {
  box: {
    p: 3,
    gap: 5,
    flexGrow: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 50px)",
    bgcolor: (theme) =>
      theme.palette.mode === "dark" ? theme.palette.background.custom : theme.palette.grey[50]
  },
  paper: {
    p: 2
  }
};

const Dashboard = () => {
  const [currentMonthSales, setCurrentMonthSales] = useState(0);
  const [currentFySales, setCurrentFySales] = useState(0);
  const [currentFyCustomersSalesInDescOrder, setCurrentFyCustomersSalesInDescOrder] = useState([]);
  const [currentFyTopCustomers, setCurrentFyTopCustomers] = useState([]);
  const [currentFyProductsSalesInDescOrder, setCurrentFyProductsSalesInDescOrder] = useState([]);
  const [currentFyTopProducts, setCurrentFyTopProducts] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

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

    const ylyData = new Map();
    let orderedYlyData = [];

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

        const invoiceFY = `${invoice.startYear}-${invoice.endYear}`;
        const invoiceYearData = ylyData.get(invoiceFY);
        ylyData.set(invoiceFY, {
          ...invoiceYearData,
          id: invoiceFY,
          startYear: invoice.startYear,
          endYear: invoice.endYear,
          sales: (invoiceYearData?.sales ?? 0) + invoice.totalAmount,
          monthlySales: {
            ...(invoiceYearData?.monthlySales ?? {}),
            [monthOfInvoice]:
              (invoiceYearData?.monthlySales[monthOfInvoice] ?? 0) + invoice.totalAmount
          }
        });
      });

      thisFyCustomersSalesInDescOrder = Array.from(thisFyCustomers.values()).sort(
        (a, b) => b.amount - a.amount
      );

      thisFyTopCustomers = thisFyCustomersSalesInDescOrder.slice(0, 3);

      thisFyProductsSalesInDescOrder = Array.from(thisFyProducts.values()).sort(
        (a, b) => b.count - a.count
      );

      thisFyTopProducts = thisFyProductsSalesInDescOrder.slice(0, 3);

      orderedYlyData = Array.from(ylyData.values()).sort((a, b) => a.startYear - b.startYear);
    }

    setYearlyData(orderedYlyData);
    setCurrentFySales(thisFySales);
    setCurrentMonthSales(thisMonthSales);
    setCurrentFyCustomersSalesInDescOrder(thisFyCustomersSalesInDescOrder);
    setCurrentFyTopCustomers(thisFyTopCustomers);
    setCurrentFyProductsSalesInDescOrder(thisFyProductsSalesInDescOrder);
    setCurrentFyTopProducts(thisFyTopProducts);
  }, [invoices]);

  const currentYearMonthlySalesObj =
    yearlyData?.find((item) => item.startYear === currentStartYear)?.monthlySales ?? null;

  // Create array of length 12 (Jan=1 ... Dec=12)
  const currentYearMonthlyArr = currentYearMonthlySalesObj
    ? Array.from({ length: 12 }, (_, i) => currentYearMonthlySalesObj[i + 1] || 0)
    : [];

  // converting to months order to FY months
  const currentYearMonthlySales =
    currentYearMonthlyArr.length > 0
      ? [...currentYearMonthlyArr.slice(3, 12), ...currentYearMonthlyArr.slice(0, 3)]
      : [];

  return (
    <Box sx={styles.box}>
      <Grid container spacing={{ xs: 3, md: 5 }}>
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
      <Grid container spacing={{ xs: 3, md: 5 }}>
        {yearlyData.length > 0 ? (
          <>
            <Grid item xs={12} sm={12} md={6}>
              <Paper elevation={2} sx={styles.paper}>
                <BarChart
                  height={400}
                  margin={{ left: 45, right: 20 }}
                  xAxis={[
                    {
                      label: "FY",
                      scaleType: "band",
                      data: yearlyData.map((item) => item.id)
                    }
                  ]}
                  yAxis={[
                    {
                      valueFormatter: (value) => `₹${value / 1000}k`
                    }
                  ]}
                  series={[
                    {
                      data: yearlyData.map((item) => item.sales),
                      label: "Sales",
                      valueFormatter: (value) => indianCurrencyFormatter(value)
                    }
                  ]}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Paper elevation={2} sx={styles.paper}>
                <LineChart
                  height={400}
                  colors={["#da00ff"]}
                  margin={{ left: 40, right: 20 }}
                  xAxis={[{ data: fyMonths, label: "Months", scaleType: "point" }]}
                  yAxis={[
                    {
                      valueFormatter: (value) => `₹${value / 1000}k`
                    }
                  ]}
                  series={[
                    {
                      data: currentYearMonthlySales,
                      label: "Monthly Sales",
                      showMark: false,
                      valueFormatter: (value) => indianCurrencyFormatter(value)
                    }
                  ]}
                />
              </Paper>
            </Grid>
          </>
        ) : null}
      </Grid>
    </Box>
  );
};

export default Dashboard;

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import { fyMonths } from "utils/constants";
import { convertToFyData, getFY, getMonthWiseData, indianCurrencyFormatter } from "utils/utilites";

import SalesStats from "./SalesStats";
import TopThreeStats from "./TopThreeStats";
import ChartTemplate from "./ChartTemplate";

const styles = {
  box: {
    p: 3,
    gap: 5,
    flexGrow: 1,
    width: "100%",
    display: "flex",
    height: "max-content",
    flexDirection: "column",
    bgcolor: (theme) =>
      theme.palette.mode === "dark" ? theme.palette.background.custom : theme.palette.grey[50]
  }
};

const Dashboard = () => {
  const [yearlyData, setYearlyData] = useState([]);
  const [sourceData, setSourceData] = useState({});
  const [currentFyTopProducts, setCurrentFyTopProducts] = useState([]);

  const { invoices } = useSelector((state) => state.invoices);
  const { sourceList = [] } = useSelector((state) => state?.customers);
  const { startYear: currentStartYear, endYear: currentEndYear, month: currentMonth } = getFY();

  useEffect(() => {
    if (sourceList && Array.isArray(sourceList) && sourceList.length > 0) {
      const sourceObj = {};
      sourceList.forEach((source) => {
        sourceObj[source.value] = 0;
      });
      setSourceData(sourceObj);
    }
  }, [sourceList]);

  useEffect(() => {
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
          invoice.products.forEach((product) => {
            thisFyProducts.set(product.productName.id, {
              id: product.productName.id,
              name: product.productName.label,
              invoiceCount:
                (thisFyProducts.get(product.productName.id)?.invoiceCount ?? 0) +
                product.productQuantityPieces,
              total:
                product.productAmountInclGST +
                (thisFyProducts.get(product.productName.id)?.total ?? 0)
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
          invoiceCount: (invoiceYearData?.invoiceCount ?? 0) + 1,
          sales: (invoiceYearData?.sales ?? 0) + invoice.totalAmount,
          sources: {
            ...(invoiceYearData?.sources ?? {}),
            [invoice.customer.source.value]: {
              id: invoice.customer.source.value,
              name: invoice.customer.source.label,
              invoiceCount:
                (invoiceYearData?.sources?.[invoice.customer.source.value]?.invoiceCount ?? 0) + 1,
              total:
                (invoiceYearData?.sources?.[invoice.customer.source.value]?.total ?? 0) +
                invoice.totalAmount
            }
          },
          customers: {
            ...(invoiceYearData?.customers ?? {}),
            [invoice.customer.id]: {
              id: invoice.customer.id,
              name: invoice.customer.name.label,
              invoiceCount:
                (invoiceYearData?.customers?.[invoice.customer.id]?.invoiceCount ?? 0) + 1,
              total:
                (invoiceYearData?.customers?.[invoice.customer.id]?.total ?? 0) +
                invoice.totalAmount
            }
          },
          months: {
            ...(invoiceYearData?.months ?? {}),
            [monthOfInvoice]: {
              invoiceCount: (invoiceYearData?.months?.[monthOfInvoice]?.invoiceCount ?? 0) + 1,
              sales: (invoiceYearData?.months?.[monthOfInvoice]?.sales ?? 0) + invoice.totalAmount,
              sources: {
                ...(invoiceYearData?.months?.[monthOfInvoice]?.sources ?? {}),
                [invoice.customer.source.value]: {
                  id: invoice.customer.source.value,
                  name: invoice.customer.source.label,
                  invoiceCount:
                    (invoiceYearData?.months?.[monthOfInvoice]?.sources?.[
                      invoice.customer.source.value
                    ]?.invoiceCount ?? 0) + 1,
                  total:
                    (invoiceYearData?.months?.[monthOfInvoice]?.sources?.[
                      invoice.customer.source.value
                    ]?.total ?? 0) + invoice.totalAmount
                }
              },
              customers: {
                ...(invoiceYearData?.months?.[monthOfInvoice]?.customers ?? {}),
                [invoice.customer.id]: {
                  id: invoice.customer.id,
                  name: invoice.customer.name.label,
                  invoiceCount:
                    (invoiceYearData?.months?.[monthOfInvoice]?.customers?.[invoice.customer.id]
                      ?.invoiceCount ?? 0) + 1,
                  total:
                    (invoiceYearData?.months?.[monthOfInvoice]?.customers?.[invoice.customer.id]
                      ?.total ?? 0) + invoice.totalAmount
                }
              }
            }
          }
        });
      });

      thisFyProductsSalesInDescOrder = Array.from(thisFyProducts.values()).sort(
        (a, b) => b.invoiceCount - a.invoiceCount
      );
      thisFyTopProducts = thisFyProductsSalesInDescOrder.slice(0, 3);

      orderedYlyData = Array.from(ylyData.values()).sort((a, b) => a.startYear - b.startYear);
    }

    setYearlyData(orderedYlyData);
    setCurrentFyTopProducts(thisFyTopProducts);
  }, [invoices]);

  const currentFyDataObj = yearlyData?.find(
    (item) => item.startYear === currentStartYear && item.endYear === currentEndYear
  );
  const currentFySales = currentFyDataObj?.sales ?? 0;
  const currentFyMonthlySalesObj = currentFyDataObj?.months ?? null;
  const currentFyMonthlySalesArr = getMonthWiseData(currentFyMonthlySalesObj, "sales");
  const currentMonthSales = currentFyMonthlySalesArr[currentMonth - 1];
  const currentFyMonthlySales = convertToFyData(currentFyMonthlySalesArr);
  const currentFyMonthlyInvoiceCountArr = getMonthWiseData(
    currentFyMonthlySalesObj,
    "invoiceCount"
  );
  const currentFyMonthlyInvoiceCount = convertToFyData(currentFyMonthlyInvoiceCountArr);

  const currentFyCustomersSalesInDescOrder = currentFyDataObj?.customers
    ? Object.values(currentFyDataObj?.customers).sort((a, b) => b.total - a.total)
    : [];

  const currentFyTopCustomers = currentFyCustomersSalesInDescOrder.slice(0, 3);
  const currentFySources = currentFyDataObj?.sources
    ? Object.values(currentFyDataObj?.sources)
    : null;
  const currentFyMonthlySourcesArr = getMonthWiseData(currentFyMonthlySalesObj, "sources");
  const currentFyMonthlySources = convertToFyData(currentFyMonthlySourcesArr).map((item) => {
    if (item === 0) return sourceData;
    const sObj = { ...sourceData };
    Object.entries(item).forEach(([k, v]) => {
      sObj[k] = v?.total ?? 0;
    });
    return sObj;
  });

  const valueFormatter = (value) => (value ? indianCurrencyFormatter(value) : `₹0`);

  const pieChartParams = {
    innerRadius: 40,
    outerRadius: 120,
    paddingAngle: 3,
    cornerRadius: 8
  };

  return yearlyData.length > 0 ? (
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
        <Grid item xs={12} sm={12} md={6}>
          <ChartTemplate title="FY-wise sales">
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
                  label: "Sales",
                  data: yearlyData.map((item) => item.sales),
                  valueFormatter
                }
              ]}
              slotProps={{
                legend: {
                  hidden: true
                }
              }}
            />
          </ChartTemplate>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <ChartTemplate title="Monthwise sales">
            <LineChart
              height={400}
              colors={["#da00ff"]}
              margin={{ left: 40, right: 20 }}
              xAxis={[
                {
                  data: fyMonths,
                  label: "Months",
                  scaleType: "point"
                }
              ]}
              yAxis={[
                {
                  valueFormatter: (value) => `₹${value / 1000}k`
                }
              ]}
              series={[
                {
                  area: true,
                  showMark: false,
                  label: "Monthly Sales",
                  data: currentFyMonthlySales,
                  valueFormatter
                }
              ]}
              slotProps={{
                legend: {
                  hidden: true
                }
              }}
            />
          </ChartTemplate>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <ChartTemplate title="Monthwise invoices">
            <BarChart
              height={400}
              colors={["#2e96ff"]}
              layout="horizontal"
              margin={{ left: 45, right: 20 }}
              yAxis={[
                {
                  data: fyMonths,
                  label: "Months",
                  scaleType: "band"
                }
              ]}
              series={[
                {
                  label: "Invoices",
                  data: currentFyMonthlyInvoiceCount
                }
              ]}
              slotProps={{
                legend: {
                  hidden: true
                }
              }}
            />
          </ChartTemplate>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <ChartTemplate title="Sourcewise invoices & sales">
            <PieChart
              height={400}
              series={[
                {
                  data: currentFySources.map(({ id, name: label, invoiceCount: value }) => ({
                    id,
                    label,
                    value
                  })),
                  ...pieChartParams,
                  cx: 140
                },
                {
                  data: currentFySources.map(({ id, name: label, total: value }, index) => ({
                    id: `${id}-${index}`,
                    label,
                    value
                  })),
                  ...pieChartParams,
                  valueFormatter: (data) => indianCurrencyFormatter(data.value),
                  cx: 400
                }
              ]}
              slotProps={{
                legend: {
                  hidden: true
                }
              }}
            />
          </ChartTemplate>
        </Grid>
        <Grid item xs={12}>
          <ChartTemplate title="Monthwise sales of sources">
            <BarChart
              height={400}
              margin={{ left: 45, right: 20 }}
              dataset={currentFyMonthlySources}
              xAxis={[
                {
                  data: fyMonths,
                  label: "Months",
                  scaleType: "band"
                }
              ]}
              series={sourceList.map((source) => ({
                dataKey: source.value,
                label: source.label,
                valueFormatter
              }))}
              slotProps={{
                legend: {
                  hidden: true
                }
              }}
            />
          </ChartTemplate>
        </Grid>
      </Grid>
    </Box>
  ) : null;
};

export default Dashboard;

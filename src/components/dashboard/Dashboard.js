/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useSelector } from "react-redux";
import Select from "@mui/material/Select";
import { DataGrid } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import StarIcon from "@mui/icons-material/Star";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useOutletContext } from "react-router-dom";
import { LineChart } from "@mui/x-charts/LineChart";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import {
  getFY,
  getFyMonths,
  convertToFyData,
  getMonthWiseData,
  indianCurrencyFormatter,
  getInvoicesPageTabs
} from "utils/utilites";
import commonStyles from "utils/commonStyles";

import SalesStats from "./SalesStats";
import TopThreeStats from "./TopThreeStats";
import ChartTemplate from "./ChartTemplate";

const styles = {
  box: {
    width: "100%",
    minHeight: "100vh",
    maxHeight: "max-content",
    bgcolor: (theme) =>
      theme.palette.mode === "dark" ? theme.palette.background.custom : theme.palette.grey[50]
  },
  stack: {
    py: 1,
    px: 3,
    top: 50,
    zIndex: 1,
    position: "sticky",
    bgcolor: (theme) =>
      theme.palette.mode === "dark" ? theme.palette.background.custom : theme.palette.grey[50]
  },
  stack1: {
    p: 3,
    gap: 5,
    flexGrow: 1,
    width: "100%"
  },
  dataGrid: {
    ...(commonStyles?.dataGrid ?? {}),
    ".MuiDataGrid-virtualScroller": {
      height: "calc(100vh - 364px)"
    },
    "& .MuiDataGrid-cell:not(:last-child)": {
      borderRight: "1px solid",
      borderColor: (theme) =>
        `${
          theme.palette.mode === "dark" ? "rgba(81, 81, 81, 1)" : "rgba(224, 224, 224, 1)"
        } !important`,
      justifyContent: "space-between",
      alignItems: "center"
    },
    "& .MuiDataGrid-cell:first-child, & .MuiDataGrid-cell:nth-last-child(2)": {
      borderRight: "3px solid"
    }
  },
  gridCellAmount: {
    fontWeight: 600,
    textAlign: "center",
    color: "primary.main"
  },
  star: (color) => ({
    color,
    fontSize: "20px"
  })
};

const Dashboard = () => {
  const [isLoading, setLoader] = useState(false);
  const [yearlyData, setYearlyData] = useState([]);
  const [sourceData, setSourceData] = useState({});
  const [currentFyTopProducts, setCurrentFyTopProducts] = useState([]);

  const fyList = getInvoicesPageTabs();
  const [selectedFY, setSelectedFY] = useState(fyList?.[0] ?? {});

  const { loading = false } = useOutletContext();
  const { invoices } = useSelector((state) => state.invoices);
  const { customers = [], sourceList = [] } = useSelector((state) => state?.customers);
  const { startYear: sy, endYear: ey, month: currentMonth } = getFY();

  const currentStartYear = String(selectedFY?.sy || sy);
  const currentEndYear = String(selectedFY?.ey || ey);

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

    try {
      setLoader(true);
      if (invoices.length > 0 && currentStartYear && currentEndYear) {
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
                  (invoiceYearData?.sources?.[invoice.customer.source.value]?.invoiceCount ?? 0) +
                  1,
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
                sales:
                  (invoiceYearData?.months?.[monthOfInvoice]?.sales ?? 0) + invoice.totalAmount,
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  }, [invoices, currentStartYear, currentEndYear]);

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

  const currentFyMonthWiseCustomersInfoArr = getMonthWiseData(
    currentFyMonthlySalesObj,
    "customers"
  );
  const currentFyMonthWiseCustomersInfo = convertToFyData(currentFyMonthWiseCustomersInfoArr);

  let customerWiseTableData = [];
  if (customers.length > 0 && currentFyMonthWiseCustomersInfo.length > 0) {
    const filteredCustomers = customers.filter(
      (c) => !currentFyCustomersSalesInDescOrder.some((cust) => cust.id === c.id)
    );

    customerWiseTableData = [...currentFyCustomersSalesInDescOrder, ...filteredCustomers].map(
      (customer) => {
        const months = currentFyMonthWiseCustomersInfo.map((c) => {
          if (typeof c === "object") {
            if (customer.id in c) return c[customer.id];
          }
          return null;
        });

        return {
          ...customer,
          months
        };
      }
    );
  }

  const valueFormatter = (value) => (value ? indianCurrencyFormatter(value) : `₹0`);

  const handleSelectChange = ({ target: { name, value } }, list) => {
    const selectedOption = list.find((option) => option.value === value);
    setSelectedFY(selectedOption);
  };

  const fyMonthsWithYrSuffix = getFyMonths(currentStartYear, currentEndYear);

  const cwTdCell = (count, amount) => (
    <Stack width="100%">
      <Chip size="small" variant="outlined" label={`${count} invoice${count === 1 ? "" : "s"}`} />
      <Typography variant="subtitle2" sx={styles.gridCellAmount}>
        {amount ? indianCurrencyFormatter(amount) : `₹0`}
      </Typography>
    </Stack>
  );

  const cwTdCols = [
    {
      field: "name",
      headerName: "Customers",
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: ({ row, value }) => {
        const goldCustomer =
          currentFyTopCustomers.length > 0 ? row.id === currentFyTopCustomers[0].id : null;
        const silverCustomer =
          currentFyTopCustomers.length > 1 ? row.id === currentFyTopCustomers[1].id : null;
        const bronzeCustomer =
          currentFyTopCustomers.length > 2 ? row.id === currentFyTopCustomers[2].id : null;

        const val = typeof value === "string" ? value : value?.label;
        const color = goldCustomer ? "common.gold" : bronzeCustomer ? "common.bronze" : "silver";

        return (
          <Stack flexDirection="row" alignItems="center">
            {goldCustomer || silverCustomer || bronzeCustomer ? (
              <StarIcon sx={styles.star(color)} />
            ) : null}
            <Tooltip title={val}>
              <Typography variant="body2">{val}</Typography>
            </Tooltip>
          </Stack>
        );
      }
    },
    ...fyMonthsWithYrSuffix.map((m, index) => ({
      field: m.toLowerCase(),
      headerName: m,
      width: 120,
      sortable: false,
      renderCell: ({ row }) =>
        row?.months?.[index]
          ? cwTdCell(row.months[index]?.invoiceCount, row.months[index]?.total)
          : null
    })),
    {
      field: "total",
      headerName: "Total",
      width: 120,
      sortable: false,
      renderCell: ({ row }) =>
        row?.invoiceCount && row?.total ? cwTdCell(row?.invoiceCount, row?.total) : null
    }
  ];

  const pieChartParams = {
    innerRadius: 40,
    outerRadius: 120,
    paddingAngle: 3,
    cornerRadius: 8
  };

  const loader = loading || isLoading;

  return (
    <Box sx={styles.box}>
      <Stack flexDirection="row" justifyContent="flex-end" sx={styles.stack}>
        <FormControl size="small" margin="dense">
          <InputLabel id="fy">FY</InputLabel>
          <Select
            id="fy"
            name="fy"
            label="FY"
            disabled={loader}
            value={selectedFY?.value ?? ""}
            onChange={(e) => handleSelectChange(e, fyList)}>
            {fyList &&
              Array.isArray(fyList) &&
              fyList.map((item) => (
                <MenuItem key={item?.value} value={item?.value}>
                  {item?.label}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Stack>
      <Stack sx={styles.stack1}>
        <Grid container spacing={{ xs: 3, md: 5 }}>
          <Grid item xs={12} sm={12} md={4}>
            <SalesStats
              loader={loader}
              currentFySales={currentFySales}
              currentMonthSales={currentMonthSales}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <TopThreeStats
              showAmount
              loader={loader}
              title="Customers"
              icon={<PersonIcon />}
              avatarBgColor="warning.main"
              list={currentFyTopCustomers}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <TopThreeStats
              loader={loader}
              title="Products"
              icon={<ShoppingBagIcon />}
              avatarBgColor="secondary.main"
              list={currentFyTopProducts}
            />
          </Grid>
        </Grid>
        <Grid container spacing={{ xs: 3, md: 5 }}>
          <Grid item xs={12} sm={12} md={6}>
            <ChartTemplate title="FY-wise sales" loader={loader}>
              {yearlyData.length > 0 ? (
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
              ) : null}
            </ChartTemplate>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <ChartTemplate title="Monthwise sales" loader={loader}>
              {yearlyData.length > 0 ? (
                <LineChart
                  height={400}
                  colors={["#da00ff"]}
                  margin={{ left: 40, right: 20 }}
                  xAxis={[
                    {
                      data: fyMonthsWithYrSuffix,
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
              ) : null}
            </ChartTemplate>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <ChartTemplate title="Monthwise invoices" loader={loader}>
              {yearlyData.length > 0 ? (
                <BarChart
                  height={400}
                  colors={["#2e96ff"]}
                  layout="horizontal"
                  margin={{ left: 60, right: 20 }}
                  yAxis={[
                    {
                      data: fyMonthsWithYrSuffix,
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
              ) : null}
            </ChartTemplate>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <ChartTemplate title="Sourcewise invoices & sales" loader={loader}>
              {yearlyData.length > 0 && currentFySources.length > 0 ? (
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
              ) : null}
            </ChartTemplate>
          </Grid>
          <Grid item xs={12}>
            <ChartTemplate title="Monthwise sales of sources" loader={loader}>
              {yearlyData.length > 0 ? (
                <BarChart
                  height={400}
                  margin={{ left: 45, right: 20 }}
                  dataset={currentFyMonthlySources}
                  xAxis={[
                    {
                      data: fyMonthsWithYrSuffix,
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
              ) : null}
            </ChartTemplate>
          </Grid>
        </Grid>

        <Stack>
          <Typography variant="h6">Monthwise customers info</Typography>
          {!loading &&
          customerWiseTableData &&
          Array.isArray(customerWiseTableData) &&
          customerWiseTableData.length > 0 ? (
            <DataGrid
              sx={styles.dataGrid}
              rows={customerWiseTableData}
              columns={cwTdCols}
              pageSizeOptions={[10]}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 }
                }
              }}
              disableColumnMenu
            />
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Dashboard;

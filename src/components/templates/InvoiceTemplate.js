/* eslint-disable no-console */
import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { useSelector } from "react-redux";
import Divider from "@mui/material/Divider";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { GST_PERCENTAGE } from "utils/constants";
import CustomDataGridFooter from "components/common/CustomDataGridFooter";
import { formatDate, formatInvoiceNumber, indianCurrencyFormatter } from "utils/utilites";

import Logo from "assets/png/Logo-Outlined.png";

const NOTES = [
  "We are not responsible for any loss or damage to goods in transit.",
  "Goods once sold cannot be returned under any circumstances.",
  "All disputes are subject to Erode jurisdiction."
];

const styles = {
  templateBox: {
    color: "black",
    width: "210mm",
    height: "308mm",
    display: "flex",
    overflow: "hidden",
    boxSizing: "border-box",
    flexDirection: "column",

    "& *": {
      userSelect: "none",
      color: (theme) => `${theme.palette.common.black} !important`
    }
  },
  logo: {
    width: 130,
    height: "auto"
  },
  bgColor: {
    bgcolor: (theme) => theme.palette.grey[100]
  },
  invoice: {
    borderRadius: "20px",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  },
  to: {
    width: "65%"
  },
  address: {
    width: "90%"
  },
  h100: {
    height: "100%"
  },
  divider: {
    borderColor: (theme) => theme.palette.common.dividerBorder
  },
  dataGrid: {
    borderColor: (theme) => theme.palette.common.tableBorder,
    ".MuiDataGrid-withBorderColor": {
      borderColor: (theme) => theme.palette.common.tableBorder
    },
    ".MuiDataGrid-cellContent": {
      fontSize: "12px"
    },
    ".MuiDataGrid-columnSeparator": {
      display: "none"
    },
    ".MuiDataGrid-columnHeader": {
      p: 0,
      bgcolor: (theme) => theme.palette.grey[100],
      "&>*": {
        flexDirection: "row !important"
      },
      "&>*>*": {
        textAlign: "center",
        justifyContent: "center",
        flexDirection: "row !important"
      }
    },
    ".MuiDataGrid-columnHeaderTitle": {
      lineHeight: "16px",
      whiteSpace: "normal",
      wordWrap: "break-word",
      fontWeight: 600
    },
    ".MuiDataGrid-columnHeaderTitleContainerContent": {
      lineHeight: "16px",
      whiteSpace: "normal",
      wordWrap: "break-word",
      fontWeight: 600
    },
    ".MuiDataGrid-footerContainer": {
      bgcolor: (theme) => theme.palette.grey[100]
    }
  },
  underline: {
    width: "fit-content",
    borderBottom: (theme) => `1px dashed ${theme.palette.common.black}`
  },
  emailIcon: { pt: "1px" }
};

const InvoiceTemplate = ({ reference, dataId }) => {
  const { invoices = [] } = useSelector((state) => state?.invoices);

  const selectedInvoice = invoices.find((item) => item?.id === dataId);
  const products = [...(selectedInvoice?.products || [])];

  if (
    selectedInvoice?.extras &&
    Array.isArray(selectedInvoice?.extras) &&
    selectedInvoice?.extras?.length
  ) {
    selectedInvoice?.extras?.forEach((item) =>
      products?.push({
        productName: { ...item?.reason },
        productAmountInclGST: item?.amount
      })
    );
  }

  const productTableColumns = [
    {
      field: "sNo",
      headerName: "S No",
      sortable: false,
      width: 50,
      renderCell: (params) =>
        params.api.state.rows.dataRowIds.findIndex((id) => id === params?.id) + 1
    },
    {
      field: "productName",
      headerName: "Particulars",
      sortable: false,
      flex: 1,
      renderCell: ({ value }) => (
        <Typography fontSize={14} fontWeight={600}>
          {value?.label}
        </Typography>
      )
    },
    {
      field: "productQuantityPieces",
      headerName: "Quantity (Pcs)",
      sortable: false,
      type: "number",
      width: 70
    },
    {
      field: "productQuantityMeters",
      headerName: "Quantity (Mtrs)",
      sortable: false,
      type: "number",
      width: 70
    },
    {
      field: "productRate",
      headerName: "Rate",
      sortable: false,
      type: "number",
      width: 70,
      valueFormatter: ({ value }) => (value ? indianCurrencyFormatter(value) : null)
    },
    {
      field: "productAmount",
      headerName: "Amount",
      sortable: false,
      type: "number",
      width: 90,
      valueFormatter: ({ value }) => (value ? indianCurrencyFormatter(value) : null)
    },
    {
      field: "producGstAmount",
      headerName: `GST (${GST_PERCENTAGE}%)`,
      sortable: false,
      type: "number",
      width: 80,
      valueFormatter: ({ value }) => (value ? indianCurrencyFormatter(value) : null)
    },
    {
      field: "productAmountInclGST",
      sortable: false,
      type: "number",
      width: 110,
      renderHeader: () => (
        <>
          Amount <br /> (Incl. GST)
        </>
      ),
      renderCell: ({ value }) => (
        <Typography fontSize={14} fontWeight={600}>
          {indianCurrencyFormatter(value)}
        </Typography>
      )
    }
  ];

  return (
    <Box sx={styles.templateBox} gap={1} ref={reference}>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" alignItems="center" gap={2}>
          <Avatar
            src={Logo}
            variant="square"
            sx={styles.logo}
            alt={process.env.REACT_APP_INVOICE_TEMPLATE_COMPANY_NAME_SHORT_FORM}
          />
        </Stack>
        <Stack alignItems="center">
          <Typography fontWeight={700} fontSize={45} letterSpacing={5}>
            {process.env.REACT_APP_INVOICE_TEMPLATE_COMPANY_NAME.toUpperCase()}
          </Typography>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <LocationOnIcon fontSize="small" />
            <Typography>{process.env.REACT_APP_INVOICE_TEMPLATE_ADDRESS}</Typography>
          </Stack>
          <Stack direction="row" gap={1}>
            <Typography>GSTIN</Typography>
            <Typography fontWeight={600}>{process.env.REACT_APP_INVOICE_TEMPLATE_GST}</Typography>
          </Stack>
        </Stack>
        <Box>
          <Stack alignItems="center" sx={[styles.invoice, styles.bgColor]} px={4} py={2}>
            <Typography fontWeight={600} fontSize={24}>
              INVOICE
            </Typography>
            <Typography fontSize={20}>#{formatInvoiceNumber(selectedInvoice)}</Typography>
          </Stack>
        </Box>
      </Stack>
      <Divider sx={styles.divider} />
      <Stack direction="row" justifyContent="space-between" sx={styles.details}>
        <Stack sx={styles.to}>
          <Typography>To</Typography>
          <Stack px={2}>
            <Typography fontWeight={600} fontSize={20}>
              {selectedInvoice?.customer?.name?.label}
            </Typography>
            <Typography sx={styles.address}>{selectedInvoice?.customer?.address}</Typography>
            <Stack direction="row" gap={2} pt={1}>
              <Stack>
                <Typography>{selectedInvoice?.customer?.gstNumber ? "GST Number" : ""}</Typography>
                <Typography>
                  {selectedInvoice?.customer?.phoneNumber ? "Phone / Landline" : ""}
                </Typography>
              </Stack>
              <Stack>
                <Typography fontWeight={600}>{selectedInvoice?.customer?.gstNumber}</Typography>
                <Typography fontWeight={600}>{selectedInvoice?.customer?.phoneNumber}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2}>
          <Stack>
            <Typography>Invoice Date</Typography>
            <Typography>Bale Count</Typography>
            <Typography>Logitstics</Typography>
            <Typography>LR Number</Typography>
            <Typography>LR Date</Typography>
            <Typography>Destination</Typography>
            <Typography>Payment Method</Typography>
          </Stack>
          <Stack>
            <Typography fontWeight={600}>{formatDate(selectedInvoice?.invoiceDate)}</Typography>
            <Typography fontWeight={600}>{selectedInvoice?.baleCount}</Typography>
            <Typography fontWeight={600} sx={styles.h100}>
              {selectedInvoice?.logistics?.label ?? ""}
            </Typography>
            <Typography fontWeight={600} sx={styles.h100}>
              {selectedInvoice?.lrNumber ?? ""}
            </Typography>
            <Typography fontWeight={600}>{formatDate(selectedInvoice?.lrDate)}</Typography>
            <Typography fontWeight={600}>{selectedInvoice?.transportDestination?.label}</Typography>
            <Typography fontWeight={600}>
              {selectedInvoice?.paymentStatus === "paid" ? "Prepaid" : "To pay"}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <DataGrid
        rowHeight={35}
        disableColumnMenu
        sx={styles.dataGrid}
        slots={{
          footer: CustomDataGridFooter
        }}
        slotProps={{
          footer: {
            columns: productTableColumns,
            rows: products,
            isPdf: true
          }
        }}
        columns={productTableColumns}
        rows={products}
        getRowId={(row) => row?.productName?.value}
      />
      <Stack direction="row" justifyContent="space-between">
        <Stack>
          <Typography fontWeight={600} sx={styles.underline}>
            Bank Details
          </Typography>
          <Stack direction="row" gap={2}>
            <Stack>
              <Typography>Bank Name</Typography>
              <Typography>AC Number</Typography>
              <Typography>IFSC</Typography>
            </Stack>
            <Stack>
              <Typography fontWeight={600}>
                {process.env.REACT_APP_INVOICE_TEMPLATE_BANK_NAME}
              </Typography>
              <Typography fontWeight={600}>
                {process.env.REACT_APP_INVOICE_TEMPLATE_BANK_AC_NUMBER}
              </Typography>
              <Typography fontWeight={600}>
                {process.env.REACT_APP_INVOICE_TEMPLATE_BANK_IFSC}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack>
          <Typography fontWeight={600} sx={styles.underline}>
            Contact Details
          </Typography>
          <Stack justifyItems="center">
            <Stack direction="row" alignItems="center" gap={2}>
              <PersonIcon fontSize="small" />
              <Typography>{process.env.REACT_APP_INVOICE_TEMPLATE_NAME}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={2}>
              <PhoneIcon fontSize="small" />
              <Typography>{process.env.REACT_APP_INVOICE_TEMPLATE_PHONE}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={2}>
              <EmailIcon fontSize="small" sx={styles.emailIcon} />
              <Typography>{process.env.REACT_APP_INVOICE_TEMPLATE_EMAIL}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Divider sx={styles.divider} />
      <Stack direction="row" justifyContent="space-between">
        <Stack>
          <Typography fontWeight={600} sx={styles.underline}>
            Terms & Conditions
          </Typography>
          <Stack>
            {NOTES.map((item, index) => (
              <Typography key={item}>
                {index + 1}. {item}
              </Typography>
            ))}
          </Stack>
        </Stack>
        <Stack justifyContent="space-between">
          <Typography>For {process.env.REACT_APP_INVOICE_TEMPLATE_COMPANY_NAME}</Typography>
          <Typography>Authorised Signature</Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default InvoiceTemplate;

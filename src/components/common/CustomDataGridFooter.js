import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { GridFooterContainer } from "@mui/x-data-grid";
import { indianCurrencyFormatter } from "utils/utilites";

const CustomDataGridFooter = ({ columns, rows = [] }) => (
  <GridFooterContainer>
    <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
      {columns.map((column) => {
        const doCalc = [
          "productQuantityPieces",
          "productQuantityMeters",
          "productAmount",
          "producGstAmount",
          "productAmountInclGST",
          "amount"
        ].some((item) => item === column?.field);
        const isAmountField = ["productAmountInclGST", "amount"].some(
          (item) => item === column?.field
        );
        const total = doCalc ? rows.reduce((sum, row) => sum + (row[column?.field] || 0), 0) : 0;
        return (
          <Box
            key={column?.field}
            sx={{
              p: "0 10px",
              flex: column?.flex,
              textAlign: "right",
              width: column?.width
            }}>
            <Box component="span" fontWeight="600">
              {column?.field === "productName" || column?.field === "reason" ? "Total" : null}
              {column?.field === "productQuantityPieces"
                ? `${total} ${total === 1 ? "pc" : "pcs"}`
                : null}
              {column?.field === "productQuantityMeters"
                ? `${total} ${total === 1 ? "mtr" : "mtrs"}`
                : null}
              {column?.field === "productAmount" || column?.field === "producGstAmount"
                ? indianCurrencyFormatter(total)
                : null}
            </Box>
            {isAmountField ? (
              <Typography fontSize={15} fontWeight={600} color="primary.main">
                {indianCurrencyFormatter(total)}
              </Typography>
            ) : null}
          </Box>
        );
      })}
    </div>
  </GridFooterContainer>
);

export default CustomDataGridFooter;

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { GridFooterContainer } from "@mui/x-data-grid";
import { indianCurrencyFormatter } from "utils/utilites";

const styles = {
  box: {
    width: "100%",
    display: "flex",
    alignItems: "center"
  },
  box2: (isPdf, column) => ({
    p: "0 10px",
    flex: column?.flex,
    textAlign: "right",
    width: column?.width,
    fontSize: isPdf ? 12 : 14
  }),
  lowercaseText: { textTransform: "lowercase" }
};

const CustomDataGridFooter = ({ columns, rows = [], isPdf = false }) => (
  <GridFooterContainer>
    <Box sx={styles.box}>
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

        const islowercaseField =
          column?.field === "productQuantityPieces" || column?.field === "productQuantityMeters";

        return (
          <Box key={column?.field} sx={styles.box2(isPdf, column)}>
            <Box component="span" fontWeight="600" sx={islowercaseField && styles.lowercaseText}>
              {(column?.field === "productName" || column?.field === "reason") && !isPdf
                ? "Total"
                : null}
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
              <Typography fontSize={15} fontWeight={isPdf ? 700 : 600} color="primary.main">
                {indianCurrencyFormatter(total)}
              </Typography>
            ) : null}
          </Box>
        );
      })}
    </Box>
  </GridFooterContainer>
);

export default CustomDataGridFooter;

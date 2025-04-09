import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { GridFooterContainer } from "@mui/x-data-grid";
import { indianCurrencyFormatter } from "utils/utilites";
import { GST_PERCENTAGE } from "utils/constants";

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
    width:
      isPdf && (column?.field === "productRate" || column?.field === "productAmount")
        ? "0px"
        : isPdf && column?.field === "producGstAmount"
          ? `calc(${column.width * 3}px - 40px)`
          : column?.width,
    fontSize: isPdf ? 12 : 14
  }),
  box3: {
    minWidth: 0
  },
  lowercaseText: { textTransform: "lowercase !important" }
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
        const roundedOffTotal = Math.ceil(total);

        const islowercaseField =
          column?.field === "productQuantityPieces" || column?.field === "productQuantityMeters";

        return (
          // eslint-disable-next-line no-unused-vars
          <Box key={column?.field} sx={(theme) => styles.box2(isPdf, column)}>
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
              {!isPdf && (column?.field === "productAmount" || column?.field === "producGstAmount")
                ? indianCurrencyFormatter(total)
                : null}
              {isPdf && column?.field === "producGstAmount" ? (
                <>
                  <Typography fontSize={12} fontWeight={600}>
                    CGST &#40;{GST_PERCENTAGE / 2}%&#41;: {indianCurrencyFormatter(total / 2)}
                  </Typography>
                  <Typography fontSize={12} fontWeight={600}>
                    SGST &#40;{GST_PERCENTAGE / 2}%&#41;: {indianCurrencyFormatter(total / 2)}
                  </Typography>
                </>
              ) : null}
            </Box>
            {isAmountField ? (
              <Typography fontSize={15} fontWeight={isPdf ? 700 : 600} color="primary.main">
                {isPdf ? indianCurrencyFormatter(roundedOffTotal) : indianCurrencyFormatter(total)}
              </Typography>
            ) : null}
            {isAmountField && isPdf && roundedOffTotal > total ? (
              <Typography fontSize={10} color="primary.main">
                &#40;Rounded Off&#41;
              </Typography>
            ) : null}
          </Box>
        );
      })}
    </Box>
  </GridFooterContainer>
);

export default CustomDataGridFooter;

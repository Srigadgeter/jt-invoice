/* eslint-disable no-restricted-globals */
import dayjs from "dayjs";
import { fyMonths } from "./constants";

export const isMobile = () => window.innerWidth <= 768;

export const trimString = (text) => (typeof text === "string" ? text.trim() : text);

export const indianCurrencyFormatter = (number) => {
  if (!isNaN(number))
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(number);
  throw new Error(`'${number}' is not a number`);
};

export const generateKeyValuePair = (label) => ({
  label,
  value: label?.toLowerCase().split(" ").join("-")
});

export const getSum = (arr, key = null, initialValue = 0) => {
  if (arr && Array.isArray(arr)) {
    if (arr.length > 0) {
      if (key) return arr.reduce((sum, item) => sum + item[key], initialValue);
      return arr.reduce((sum, item) => sum + item, initialValue);
    }
    return 0;
  }
  return 0;
};

export const getNow = () => dayjs().toISOString();

export const formatDate = (date) => dayjs(date).format("DD MMM YYYY");

export const formatDateToISOString = (date) => dayjs(date).toISOString();

export const firebaseDateToISOString = (date) => date.toDate().toISOString();

export const formatDateForInputField = (date) => dayjs(date).format("YYYY-MM-DD");

export const getDaysDiff = (d1, d2 = new Date(), showAgo = false) => {
  const date1 = dayjs(d1);
  const date2 = dayjs(d2 ?? new Date());
  let diff = "";
  const dayDiff = date2.diff(date1, "d");
  if (dayDiff) diff = `${dayDiff} day${dayDiff === 1 ? "" : "s"}`;
  else {
    const hourDiff = date2.diff(date1, "h");

    if (hourDiff) diff = `${hourDiff} hour${hourDiff === 1 ? "" : "s"}`;
    else {
      const minuteDiff = date2.diff(date1, "m");

      if (minuteDiff) diff = `${minuteDiff} minute${minuteDiff === 1 ? "" : "s"}`;
      else diff = "a few seconds";
    }
  }
  return `${diff}${showAgo ? " ago" : ""}`;
};

// Check if the current time is after or on 6 PM
export const isEveningNow = () => new Date().getHours() >= 18;

export const getFY = () => {
  const now = dayjs();
  const month = now.format("M");
  const currentYear = now.format("YYYY");
  const lastYear = now.subtract(1, "y").format("YYYY");
  const nextYear = now.add(1, "y").format("YYYY");
  const startYear = month < 4 ? lastYear : currentYear;
  const endYear = month < 4 ? currentYear : nextYear;

  return {
    startYear,
    endYear,
    month
  };
};

export const getNewInvoiceNumber = (invoices) => {
  const { startYear: sy, endYear: ey } = getFY();

  // get only current FY invoices
  const currentFYInvoices = invoices.filter(
    (invoice) => Number(invoice.startYear) === Number(sy) && Number(invoice.endYear) === Number(ey)
  );

  const lastInvoiceNumber = currentFYInvoices.reduce(
    (max, val) => (val?.invoiceNumber > max ? val?.invoiceNumber : max),
    0
  );
  return lastInvoiceNumber + 1;
};

export const formatInvoiceNumber = (invoice, isFull = false) => {
  const { invoiceNumber, startYear, endYear } = invoice;
  const str = `0000${invoiceNumber}`;
  const invoiceNumStr = str.slice(-5);
  return isFull
    ? `${process.env.REACT_APP_INVOICE_TEMPLATE_COMPANY_NAME_SHORT_FORM}${startYear}${endYear}TX${invoiceNumStr}`
    : invoiceNumStr;
};

// export const downloadFile = ({ fileName, extension, url = null, blob = null }) => {
//   // Create a new anchor element
//   const a = document.createElement("a");

//   let fileUrl = null;
//   if (url) fileUrl = url;
//   else if (blob) fileUrl = window.URL.createObjectURL(url);

//   if (fileUrl) {
//     // Set the href, download & target attributes for the anchor element
//     a.href = fileUrl;
//     a.download = `${fileName}.${extension}`;
//     a.target = "_blank";

//     // Required for Firefox
//     // Attaches the anchor tag to the DOM
//     document.body.appendChild(a);

//     // Programmatically trigger a click on the anchor element
//     a.click();

//     // Removes the anchor tag from the DOM
//     document.body.removeChild(a);
//   }
// };

export const removeItemFromLS = (key) => localStorage.removeItem(key);

export const getItemFromLS = (key, doParse = false) =>
  doParse ? JSON.parse(localStorage.getItem(key)) : localStorage.getItem(key);

export const setItemToLS = (key, data, doStringify = false) =>
  doStringify ? localStorage.setItem(key, JSON.stringify(data)) : localStorage.setItem(key, data);

export const sortByStringProperty = (arr, prop) =>
  arr.sort((a, b) => {
    const x = a[prop];
    const y = b[prop];
    if (x < y) return -1; // sort x before y
    if (x > y) return 1; // sort y before x
    return 0; // keep original order of x & y
  });

export const getInvoicesPageTabs = () => {
  const { startYear: sy } = getFY();
  const tabs = [];

  // eslint-disable-next-line no-plusplus
  for (let i = Number(sy); i >= Number(process.env.REACT_APP_INVOICE_START_YEAR); i--) {
    tabs.push({
      sy: i,
      ey: i + 1,
      value: `${i}-${i + 1}`,
      label: `${i}-${i + 1}`
    });
  }

  return tabs;
};

// Create array of length 12 (Jan=1 ... Dec=12), assign fallback value (0) if no data available for the particular month
export const getMonthWiseData = (obj, property, fallback = 0) =>
  obj ? Array.from({ length: 12 }, (_, i) => obj[i + 1]?.[property] ?? fallback) : [];

// converting to calendar months order to FY months order
export const convertToFyData = (list) =>
  list && Array.isArray(list) && list.length > 0 ? [...list.slice(3, 12), ...list.slice(0, 3)] : [];

export const getFyMonths = (startYear, endYear, divider = " ") =>
  fyMonths && Array.isArray(fyMonths) && fyMonths.length > 0 && startYear < endYear
    ? [
        ...[...fyMonths.slice(0, 9)].map((month) => `${month}${divider}${startYear}`),
        ...[...fyMonths.slice(-3)].map((month) => `${month}${divider}${endYear}`)
      ]
    : [];

export const commonSelectOnChangeHandler = (name, value, list, setFieldValue) => {
  if (value === "") {
    setFieldValue(name, { label: "None", value: "" });
  } else if (value === "new") {
    setFieldValue(name, { label: "New", value: "new" });
  } else {
    const selectedOption = list.find((option) => option.value === value);
    setFieldValue(name, { label: selectedOption?.label, value: selectedOption?.value });
  }
};

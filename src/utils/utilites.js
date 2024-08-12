/* eslint-disable no-restricted-globals */
import dayjs from "dayjs";
import utc from "dayjs-plugin-utc";

dayjs.extend(utc);

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

export const NowInUTC = dayjs().utc();

export const formatDate = (date) => dayjs(date).utc().format("DD MMM YYYY");

export const getDaysDiff = (d1, d2 = new Date(), numberOnly = false) => {
  const date1 = dayjs(d1).utc();
  const date2 = dayjs(d2).utc();
  const diff = date2.diff(date1, "d");
  return numberOnly ? diff : `${diff} day${diff > 1 ? "s" : ""}`;
};

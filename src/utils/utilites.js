/* eslint-disable no-restricted-globals */
import dayjs from "dayjs";
import { addDoc } from "firebase/firestore";

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

export const Now = dayjs().toISOString();

export const formatDate = (date) => dayjs(date).format("DD MMM YYYY");

export const formatDateToISOString = (date) => dayjs(date).toISOString();

export const firebaseDateToISOString = (date) => date.toDate().toISOString();

export const formatDateForInputField = (date) => dayjs(date).format("YYYY-MM-DD");

export const getDaysDiff = (d1, d2 = new Date(), numberOnly = false) => {
  const date1 = dayjs(d1);
  const date2 = dayjs(d2);
  const diff = date2.diff(date1, "d");
  return numberOnly ? diff : `${diff} day${diff > 1 ? "s" : ""}`;
};

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
    endYear
  };
};

export const addDocToFirebase = async (collectionRef, payload) => {
  let docRef = null;
  let id = null;

  try {
    docRef = await addDoc(collectionRef, payload);
    id = docRef?.id;
  } catch (error) {
    console.error(error);
  }

  return { docRef, id };
};

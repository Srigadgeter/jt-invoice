import { collection, getDocs } from "firebase/firestore";

import { db } from "integrations/firebase";
import { setUser } from "store/slices/appSlice";
import { setInvoices } from "store/slices/invoicesSlice";
import { setProducts } from "store/slices/productsSlice";
import { setCustomers } from "store/slices/customersSlice";
import { firebaseDateToISOString, getItemFromLS } from "utils/utilites";
import { FIREBASE_COLLECTIONS, LOCALSTORAGE_KEYS } from "utils/constants";

const { INVOICES, PRODUCTS, CUSTOMERS } = FIREBASE_COLLECTIONS;

const invoicesCollectionRef = collection(db, INVOICES);
const productsCollectionRef = collection(db, PRODUCTS);
const customersCollectionRef = collection(db, CUSTOMERS);

// Serialize the TimeStamp data
const serializeTimeStampData = (value) => {
  if (value && (value instanceof Date || typeof value.toDate === "function"))
    return firebaseDateToISOString(value);
  return value;
};

// Serialize the data
const serializeData = (obj) => {
  const modifiedData = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (key === "updatedAt")
      modifiedData.updatedAt = value?.map((timeStamp) => serializeTimeStampData(timeStamp));
    // Serialize firebase timestamp data otherwise return value
    else modifiedData[key] = serializeTimeStampData(value);
  });
  return modifiedData;
};

// Serialize the Invoice data
const serializeInvoiceData = (dispatch, productArray, customerArray, invoiceArray) => {
  const serializedInvoices = [];

  invoiceArray.forEach((invoice) => {
    const modifiedData = {};
    Object.entries(invoice).forEach(([key, value]) => {
      // Serialize firebase products reference data
      if (key === "products") {
        const modifiedProducts = value?.map((product) => ({
          ...product,
          productName: productArray.filter((p) => p?.id === product?.productName?.id)?.[0]
        }));
        modifiedData.products = modifiedProducts;
      }
      // Serialize firebase customers reference data
      else if (key === "customer") {
        const customer = customerArray.filter((c) => c?.id === value?.id)?.[0];
        modifiedData.customer = customer;
        modifiedData.customerName = { id: customer?.id, ...customer?.name };
      } else if (key === "updatedAt")
        modifiedData.updatedAt = value?.map((timeStamp) => serializeTimeStampData(timeStamp));
      // Serialize firebase timestamp data otherwise return value
      else modifiedData[key] = serializeTimeStampData(value);
    });
    serializedInvoices.push(modifiedData);
  });

  dispatch(setInvoices(serializedInvoices));
};

export const fetchData = async (dispatch, setLoader, invoices, products, customers) => {
  setLoader(true);
  try {
    // Function to get all products
    const fetchedProducts = [...products];

    if (!(fetchedProducts && Array.isArray(fetchedProducts) && fetchedProducts.length > 0)) {
      console.warn("<< fetching products >>");
      await getDocs(productsCollectionRef)
        .then((querySnapshot) => querySnapshot.docs)
        .then((docs) => {
          docs.forEach((d) => fetchedProducts.push({ ...serializeData(d.data()), id: d?.id }));
          dispatch(setProducts(fetchedProducts));
        });
    }

    // Function to get all customers
    const fetchedCustomers = [...customers];

    if (!(fetchedCustomers && Array.isArray(fetchedCustomers) && fetchedCustomers.length > 0)) {
      console.warn("<< fetching customers >>");
      await getDocs(customersCollectionRef)
        .then((querySnapshot) => querySnapshot.docs)
        .then((docs) => {
          docs.forEach((d) => fetchedCustomers.push({ ...serializeData(d.data()), id: d?.id }));
          dispatch(setCustomers(fetchedCustomers));
        });
    }

    // Function to get all invoices
    if (
      !(invoices && Array.isArray(invoices) && invoices.length > 0) &&
      fetchedProducts &&
      Array.isArray(fetchedProducts) &&
      fetchedProducts.length > 0 &&
      fetchedCustomers &&
      Array.isArray(fetchedCustomers) &&
      fetchedCustomers.length > 0
    ) {
      console.warn("<< fetching invoices >>");
      await getDocs(invoicesCollectionRef)
        .then((querySnapshot) => querySnapshot.docs)
        .then((docs) => {
          const fetchedInvoices = docs.map((d) => ({ ...d.data(), id: d?.id }));
          serializeInvoiceData(dispatch, fetchedProducts, fetchedCustomers, fetchedInvoices);
        });
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoader(false);
  }
};

// restore the redux store from localStorage
export const restoreAppData = (dispatch) => {
  const { LS_USER, LS_INVOICES, LS_PRODUCTS, LS_CUSTOMERS } = LOCALSTORAGE_KEYS;

  const storedUser = getItemFromLS(LS_USER, true) || {};
  const storedInvoices = getItemFromLS(LS_INVOICES, true) || [];
  const storedProducts = getItemFromLS(LS_PRODUCTS, true) || [];
  const storedCustomers = getItemFromLS(LS_CUSTOMERS, true) || [];

  dispatch(setUser(storedUser));
  if (LS_INVOICES.length > 0) dispatch(setInvoices(storedInvoices));
  if (LS_PRODUCTS.length > 0) dispatch(setProducts(storedProducts));
  if (LS_CUSTOMERS.length > 0) dispatch(setCustomers(storedCustomers));
};

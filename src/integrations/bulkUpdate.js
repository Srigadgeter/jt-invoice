import { collection, getDocs, writeBatch, doc } from "firebase/firestore";

import { db } from "integrations/firebase";
import { FIREBASE_COLLECTIONS } from "utils/constants";
import { setCustomers } from "store/slices/customersSlice";
import { addNotification } from "store/slices/notificationsSlice";

// Function helps to write document to the firestore
export const bulkUpdateCustomerCollection = async (dispatch, customers, setLoader) => {
  const { CUSTOMERS } = FIREBASE_COLLECTIONS;

  try {
    setLoader(true);
    const customersCollectionRef = collection(db, CUSTOMERS);
    const querySnapshot = await getDocs(customersCollectionRef);

    let batch = writeBatch(db);
    let counter = 0;

    const updateData = { source: { label: "Direct", value: "direct" } };

    querySnapshot.forEach((document) => {
      const docRef = doc(db, CUSTOMERS, document.id);

      // Add "source" field without overwriting existing fields
      batch.set(docRef, updateData, { merge: true });

      counter += 1;

      // Commit batch every 500 docs
      if (counter === 500) {
        batch.commit();
        batch = writeBatch(db);
        counter = 0;
      }
    });

    // Commit remaining docs
    if (counter > 0) {
      await batch.commit();
    }

    const updatedCustomers = customers.map((customer) => ({
      ...customer,
      ...updateData
    }));

    dispatch(setCustomers(updatedCustomers));

    dispatch(
      addNotification({
        message: "Bulk update completed!",
        variant: "success"
      })
    );
  } catch (error) {
    console.error(error);
    dispatch(
      addNotification({
        message: "Something went wrong!"
      })
    );
  } finally {
    setLoader(false);
  }
};

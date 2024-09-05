import { addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

import { db } from "integrations/firebase";
import { addNotification } from "store/slices/notificationsSlice";

// Function helps to write document to the firestore
export const addDocToFirestore = async (
  collectionRef,
  payload,
  dispatch,
  successMessage,
  errorMessage
) => {
  let docRef = null;
  let id = null;

  try {
    // Write the document to the firestore & get back the document reference
    docRef = await addDoc(collectionRef, payload);
    id = docRef?.id;

    dispatch(
      addNotification({
        message: successMessage,
        variant: "success"
      })
    );
  } catch (error) {
    console.error(error);
    dispatch(
      addNotification({
        message: errorMessage
      })
    );
  }

  // Returning the document reference & id of a new document
  return { docRef, id };
};

// Function helps to update document in the firestore
export const editDocInFirestore = async (
  collectionName,
  payload,
  dispatch,
  successMessage,
  errorMessage
) => {
  const { id, ...rest } = payload;

  try {
    // Create a reference to the document to edit
    const docRef = doc(db, collectionName, id);

    // Update the document
    await updateDoc(docRef, { ...rest });

    dispatch(
      addNotification({
        message: successMessage,
        variant: "success"
      })
    );
  } catch (error) {
    console.error(error);
    dispatch(
      addNotification({
        message: errorMessage
      })
    );
  }
};

// Function helps to delete document from the firestore
export const deleteDocFromFirestore = async (
  rowData,
  collectionName,
  setLoader,
  dispatch,
  storeFn,
  successMessage,
  errorMessage
) => {
  if (rowData?.id) {
    setLoader(true);

    try {
      // Create a reference to the document to delete
      const docRef = doc(db, collectionName, rowData?.id);

      // Delete the document on firebase firestore
      await deleteDoc(docRef);

      // Delete product from the store
      dispatch(storeFn(rowData));

      dispatch(
        addNotification({
          message: successMessage,
          variant: "success"
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(
        addNotification({
          message: errorMessage
        })
      );
    } finally {
      setLoader(false);
    }
  }
};

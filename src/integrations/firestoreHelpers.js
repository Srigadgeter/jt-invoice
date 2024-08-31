import { addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

import { db } from "integrations/firebase";

// Function helps to write document to the firestore
export const addDocToFirestore = async (collectionRef, payload) => {
  let docRef = null;
  let id = null;

  try {
    // Write the document to the firestore & get back the document reference
    docRef = await addDoc(collectionRef, payload);
    id = docRef?.id;
  } catch (error) {
    console.error(error);
  }

  // Returning the document reference & id of a new document
  return { docRef, id };
};

// Function helps to update document in the firestore
export const editDocInFirestore = async (collectionName, payload, errorMessage) => {
  const { id, ...rest } = payload;

  try {
    // Create a reference to the document to edit
    const docRef = doc(db, collectionName, id);

    // Update the document
    await updateDoc(docRef, { ...rest });
  } catch (error) {
    console.error(error);
    throw new Error(errorMessage);
  }
};

// Function helps to delete document from the firestore
export const deleteDocFromFirestore = async (
  rowData,
  collectionName,
  setLoader,
  dispatch,
  storeFn
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  }
};

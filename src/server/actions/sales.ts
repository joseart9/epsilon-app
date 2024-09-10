"use server";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore/lite";
import firebase from "@/firebase";

import Sale from "@/types/sale";

const db = getFirestore(firebase);

// Function to save a sale to db
export async function saveSale(sale: Sale): Promise<any> {
  const salesRef = collection(db, "ventas");
  await addDoc(salesRef, sale);

  return {
    status: 200,
    message: "Venta guardada",
  };
}

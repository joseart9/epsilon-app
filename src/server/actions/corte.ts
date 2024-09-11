"use server";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
} from "firebase/firestore/lite";
import firebase from "@/firebase";

const db = getFirestore(firebase);

import Corte from "@/types/corte";

// Function to save a Corte to db
export async function saveCorteData(corte: Corte): Promise<void> {
  try {
    // Referencia a la colección 'corte'
    const corteCollectionRef = collection(db, "corte");

    // Guardar los datos en Firestore
    await addDoc(corteCollectionRef, {
      storeId: corte.storeId,
      efectivo: corte.efectivo,
      tarjeta: corte.tarjeta,
      gastos: corte.gastos,
      date: corte.date,
      userId: corte.userId,
    });

    console.log("Corte guardado exitosamente");
  } catch (error) {
    console.error("Error al guardar el corte: ", error);
  }
}

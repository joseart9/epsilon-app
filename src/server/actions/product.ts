"use server";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore/lite";
import firebase from "@/firebase";

const db = getFirestore(firebase);

import Product from "@/types/product";

export async function getProductsByStoreId(
  storeId: number
): Promise<Product[]> {
  const franquiciasRef = collection(db, "franquicia");
  const q = query(franquiciasRef, where("id", "==", storeId));
  const querySnapshot = await getDocs(q);

  const products: Product[] = [];

  if (!querySnapshot.empty) {
    const franquiciaDoc = querySnapshot.docs[0];
    const productsData = franquiciaDoc.data().products as Product[];
    products.push(...productsData);
  }

  return products;
}

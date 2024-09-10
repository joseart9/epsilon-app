"use server";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore/lite";
import firebase from "@/firebase";

const db = getFirestore(firebase);

import Product from "@/types/product";

// Function to get all products of a store given a storeId
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

// Function to update a product of a store given a storeId and a product
export async function updateProductByStoreId(
  storeId: number,
  originalSku: string, // SKU original para identificar el producto a actualizar
  product: Product
): Promise<void> {
  const franquiciasRef = collection(db, "franquicia");
  const q = query(franquiciasRef, where("id", "==", storeId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const franquiciaDoc = querySnapshot.docs[0];
    const productsData = franquiciaDoc.data().products as Product[];

    // Elimina el producto con el SKU original
    const filteredProducts = productsData.filter(
      (franchiseProduct) => franchiseProduct.sku !== originalSku
    );

    // Añade el producto actualizado (con el nuevo SKU si cambió)
    const updatedProducts = [...filteredProducts, product];

    // Actualiza el documento en Firebase con los productos modificados
    await updateDoc(franquiciaDoc.ref, {
      products: updatedProducts,
    });
  } else {
    console.error(`No se encontró ninguna franquicia con el id: ${storeId}`);
  }
}

// Function to create a new product in a store given a storeId and a product
export async function createProductByStoreId(
  storeId: number,
  product: Product
): Promise<void> {
  const franquiciasRef = collection(db, "franquicia");
  const q = query(franquiciasRef, where("id", "==", storeId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const franquiciaDoc = querySnapshot.docs[0];
    const productsData = franquiciaDoc.data().products as Product[];

    // Añade el nuevo producto a la lista de productos
    const updatedProducts = [...productsData, product];

    // Actualiza el documento en Firebase con los productos modificados
    await updateDoc(franquiciaDoc.ref, {
      products: updatedProducts,
    });
  } else {
    console.error(`No se encontró ninguna franquicia con el id: ${storeId}`);
  }
}

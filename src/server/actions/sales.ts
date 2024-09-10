"use server";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  getDoc,
  doc,
} from "firebase/firestore";
import firebase from "@/firebase";

import Sale from "@/types/sale";
import Product from "@/types/product";

const db = getFirestore(firebase);

// Function to save a sale to db
export async function saveSale(sale: Sale, storeId: number): Promise<any> {
  const salesRef = collection(db, "ventas");

  // Guardar la venta en la colección "ventas"
  await addDoc(salesRef, sale);

  // Buscar el documento en la colección "franquicia" donde el campo "id" coincida con el storeId
  const franchisesRef = collection(db, "franquicia");
  console.log(storeId);
  const q = query(franchisesRef, where("id", "==", storeId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return {
      status: 404,
      message: "Franquicia no encontrada",
    };
  }

  // Como el storeId es único, esperamos un solo documento
  const franchiseDoc = querySnapshot.docs[0];
  const franchiseData = franchiseDoc.data();

  // Verificar si la franquicia tiene productos
  if (franchiseData.products && Array.isArray(franchiseData.products)) {
    const updatedProducts = franchiseData.products.map(
      (franchiseProduct: Product) => {
        // Encontrar el producto que coincide en la venta por SKU
        const soldProduct = sale.products.find(
          (p) => p.sku === franchiseProduct.sku
        );

        if (soldProduct) {
          // Restar la cantidad vendida del stock
          return {
            ...franchiseProduct,
            stock: franchiseProduct.stock - soldProduct.stock, // Restar la cantidad vendida
          };
        }
        return franchiseProduct;
      }
    );

    // Actualizar el stock de los productos en la franquicia
    await updateDoc(doc(db, "franquicia", franchiseDoc.id), {
      products: updatedProducts,
    });
  }

  return {
    status: 200,
    message: "Venta guardada y stock actualizado",
  };
}

// Function to get all sales given a storeId from db
export async function getSalesByStoreId(storeId: number): Promise<Sale[]> {
  const salesRef = collection(db, "ventas");
  const q = query(salesRef, where("storeId", "==", storeId));
  const querySnapshot = await getDocs(q);

  const sales: Sale[] = [];

  querySnapshot.forEach((doc) => {
    sales.push(doc.data() as Sale);
  });

  return sales;
}

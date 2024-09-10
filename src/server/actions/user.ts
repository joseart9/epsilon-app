"use server";

import {
  getFirestore,
  collection,
  getDoc,
  doc,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore/lite";
import firebase from "@/firebase";

const db = getFirestore(firebase);

import User from "@/types/user";

export async function getUser(identifier: string): Promise<User | null> {
  const usersRef = collection(db, "user");
  const q = query(usersRef, where("identifier", "==", identifier));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    return userDoc.data() as User;
  }

  return null;
}

// ...new file...
import { collection, addDoc, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function fetchSections() {
  const col = collection(db, "secciones");
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createSection(payload: any) {
  const col = collection(db, "secciones");
  const ref = await addDoc(col, payload);
  return ref.id;
}

export async function updateSection(id: string, payload: any) {
  const ref = doc(db, "secciones", id);
  await setDoc(ref, payload, { merge: true });
}

export async function deleteSection(id: string) {
  const ref = doc(db, "secciones", id);
  await deleteDoc(ref);
}
// ...new file...
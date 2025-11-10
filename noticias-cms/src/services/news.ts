import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import type { News } from "../types";

export async function createNews(payload: any) {
  const col = collection(db, "noticias");
  const docRef = await addDoc(col, {
    ...payload,
    fechaCreacion: serverTimestamp(),
    fechaActualizacion: serverTimestamp()
  });
  return docRef.id;
}

export async function updateNews(id: string, payload: any) {
  const ref = doc(db, "noticias", id);
  await updateDoc(ref, { ...payload, fechaActualizacion: serverTimestamp() });
}

export async function updateNewsStatus(newsId: string, newStatus: string) {
  try {
    const ref = doc(db, "noticias", newsId);
    await updateDoc(ref, {
      estado: newStatus,
      fechaActualizacion: serverTimestamp()
    });
    return true;
  } catch (err) {
    console.error("updateNewsStatus:", err);
    throw err;
  }
}

export async function getPublishedNews(): Promise<News[]> {
  try {
    const q = query(
      collection(db, "noticias"),
      where("estado", "==", "Publicado"),
      orderBy("fechaCreacion", "desc")
    );
    const snap = await getDocs(q);
    // Aseguramos el tipo News[]
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as News[];
  } catch (err: any) {
    console.error("getPublishedNews error:", err);
    const msg = String(err?.message ?? err).toLowerCase();
    if (msg.includes('requires an index') || msg.includes('index')) {
      const allSnap = await getDocs(collection(db, "noticias"));
      const arr = allSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as News[];
      // filtrar y ordenar localmente, ya con tipo News[]
      return arr
         .filter((n: any) => n?.estado === 'Publicado')
         .sort((a: any, b: any) => {
           const ta = a.fechaCreacion?.toMillis?.() ?? new Date(a.fechaCreacion).getTime();
           const tb = b.fechaCreacion?.toMillis?.() ?? new Date(b.fechaCreacion).getTime();
           return tb - ta;
         });
    }
    throw err;
  }
}

export async function getAllNews() {
  try {
    const q = query(collection(db, "noticias"), orderBy("fechaCreacion", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("getAllNews:", err);
    throw err;
  }
}

export async function getNewsByAuthor(uid?: string) {
  try {
    if (!uid) return [];
    const q = query(
      collection(db, "noticias"),
      where("uid", "==", uid),
      orderBy("fechaCreacion", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("getNewsByAuthor:", err);
    throw err;
  }
}

export function subscribeNewsForUser(uid: string | undefined, role: string, cb: (items: any[]) => void) {
  const col = collection(db, "noticias");
  let q;
  if (role === "editor") {
    q = query(col, orderBy("fechaCreacion", "desc"));
  } else if (role === "reportero" && uid) {
    q = query(col, where("uid", "==", uid), orderBy("fechaCreacion", "desc"));
  } else {
    // usuario / público -> solo publicados
    q = query(col, where("estado", "==", "Publicado"), orderBy("fechaCreacion", "desc"));
  }
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}
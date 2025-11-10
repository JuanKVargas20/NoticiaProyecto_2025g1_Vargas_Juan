import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export const registerUser = async (
  email: string,
  password: string,
  displayName = "",
  roles: string[] = ["reportero"]
): Promise<User> => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  await setDoc(
    doc(db, "usuarios", user.uid),
    {
      correo: user.email,
      nombre: displayName,
      roles, // se guarda como array
      fechaRegistro: serverTimestamp(),
      uid: user.uid,
    },
    { merge: true }
  );

  return user;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    // limpiar datos antiguos de roles
    localStorage.removeItem("userRoles");
    sessionStorage.removeItem("guestRole");
    console.log("✅ Logout exitoso");
  } catch (err) {
    console.error("❌ Error al cerrar sesión:", err);
    throw err;
  }
};

export const getUserProfile = async (uid: string) => {
  const ref = doc(db, "usuarios", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data();

  // Normalización de roles
  let roles: string[] = [];

  if (data.roles !== undefined) {
    if (Array.isArray(data.roles)) roles = data.roles;
    else if (typeof data.roles === "string") roles = [data.roles];
  } else if (data.rol !== undefined) {
    if (Array.isArray(data.rol)) roles = data.rol;
    else if (typeof data.rol === "string") roles = [data.rol];
  }

  const primaryRole = roles.length ? roles[0] : null;
  return { ...data, roles, primaryRole };
};

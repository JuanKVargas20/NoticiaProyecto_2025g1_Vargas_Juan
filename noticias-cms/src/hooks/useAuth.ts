import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { getUserProfile } from "../services/auth";
import { useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);
  const [primaryRole, setPrimaryRole] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const profile = await getUserProfile(u.uid);
        const r = profile?.roles ?? [];
        setRoles(r);
        setPrimaryRole(profile?.primaryRole ?? null);

        localStorage.setItem("userRoles", JSON.stringify(r));
        console.log("[Auth] perfil normalizado:", { uid: u.uid, roles: r, profile });
      } else {
        setRoles([]);
        setPrimaryRole(null);
        localStorage.removeItem("userRoles");
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const hasRole = (roleName: string) => roles.includes(roleName);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRoles([]);
      setPrimaryRole(null);
      localStorage.removeItem("userRoles");
      console.log("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  };

  return { user, loading, roles, primaryRole, hasRole, logout };
}

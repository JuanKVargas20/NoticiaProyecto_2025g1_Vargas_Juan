import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PrivateRoute = ({ children, requiredRoles }: { children: React.ReactElement; requiredRoles?: string[] }) => {
  const { user, loading, hasRole } = useAuth();

  // debug rápido
  console.log("PrivateRoute:", { userId: user?.uid ?? null, loading, requiredRoles });

  if (loading) return <div>Cargando...</div>;
  if (!user) {
    console.log("PrivateRoute: no autenticado -> redirect /login");
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && requiredRoles.length) {
    try {
      const allowed = requiredRoles.some(r => {
        const ok = hasRole(r);
        console.log(`PrivateRoute: check role ${r} =>`, ok);
        return ok;
      });
      if (!allowed) {
        console.log("PrivateRoute: roles insuficientes -> redirect /");
        return <Navigate to="/" replace />;
      }
    } catch (e) {
      console.error("PrivateRoute: error evaluando roles", e);
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
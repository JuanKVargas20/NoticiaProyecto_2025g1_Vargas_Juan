import React, { useState } from "react";
import { loginUser, getUserProfile } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const user = await loginUser(email, password);
      if (!user) throw new Error("No se pudo obtener el usuario.");
      const profile = await getUserProfile(user.uid);

      let roles: string[] = ["usuario"];
      if (profile) {
        const p: any = profile;
        if (Array.isArray(p.roles)) roles = p.roles;
        else if (typeof p.roles === "string") roles = [p.roles];
      }

      localStorage.setItem("userRoles", JSON.stringify(roles));
      navigate("/dashboard");
    } catch (error: any) {
      const message = error?.code ? `${error.code} - ${error.message}` : String(error);
      setErr(message);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container glass-card">
        <h2 className="login-title">Bienvenido</h2>
        <p className="login-subtitle">Accede con tu cuenta para continuar</p>

        {err && <div className="error-box">{err}</div>}

        <form onSubmit={submit}>
          {/* Input Email */}
          <div className="input-wrapper">
            <div className="icon"><Mail /></div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Input Password */}
          <div className="input-wrapper">
            <div className="icon"><Lock /></div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button className="btn-glow" type="submit">
            Iniciar Sesión
          </button>
        </form>

        <p className="register-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;

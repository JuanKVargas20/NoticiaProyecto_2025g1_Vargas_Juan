import React, { useState } from "react";
import { registerUser } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import "./Login.css"; // reutilizamos el CSS del login

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (password.length < 6) {
      return setErr("La contraseña debe tener al menos 6 caracteres.");
    }

    try {
      const user = await registerUser(email, password, name, ["reportero"]);
      if (user) navigate("/dashboard");
      else setErr("No se pudo crear la cuenta. Revisa la consola.");
    } catch (error: any) {
      console.error("register error:", error);
      setErr(error?.message ?? String(error));
    }
  };

  return (
    <main className="login-page">
      <div className="login-container glass-card">
        <h2 className="login-title">Crear cuenta</h2>
        <p className="login-subtitle">Ingresa tus datos para registrarte</p>

        {err && <div className="error-box">{err}</div>}

        <form onSubmit={onSubmit}>
          {/* Nombre */}
          <div className="input-wrapper">
            <div className="icon"><User /></div>
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
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

          {/* Contraseña */}
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
            Registrarme
          </button>
        </form>

        <p className="register-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;

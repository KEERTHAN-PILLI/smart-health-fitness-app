import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import "../styles/auth.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      login(token, user.role);

      if (user.role === "TRAINER") {
        navigate("/trainer-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          <p style={{ textAlign: "right", marginTop: "6px" }}>
            <Link to="/forgot-password">Forgot password?</Link>
          </p>

          <p style={{ textAlign: "center", marginTop: "10px" }}>
            Don’t have an account?{" "}
            <Link to="/register" style={{ color: "#1d2671" }}>
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

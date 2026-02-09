import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import "../styles/auth.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 useEffect(() => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // only redirect if we are on login page
  if (window.location.hash === "#/login" && token && role) {
    if (role === "TRAINER") {
      navigate("/trainer-dashboard", { replace: true });
    } else {
      navigate("/user-dashboard", { replace: true });
    }
  }
}, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // ✅ Save auth data
      login(token, user.role);

      // ✅ Redirect based on role
      if (user.role === "TRAINER") {
        navigate("/trainer-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
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


          <p style={{ textAlign: "center", marginTop: "2px" ,fontSize:"12px"}}>
  <Link to="/forgot-password">Forgot password?</Link>
</p>


          <button type="submit">Login</button>

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

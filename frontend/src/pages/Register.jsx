import { useState } from "react";
import api from "../api/axios";
import "../styles/auth.css";
import { Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      alert("Registration successful");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <select name="role" onChange={handleChange}>
            <option value="USER">User</option>
            <option value="TRAINER">Trainer</option>
          </select>
          <button>Create Account</button>
          <p style={{ textAlign: "center", marginTop: "10px" }}>
  Already have an account?{" "}
  <Link to="/login" style={{ color: "#1d2671" }}>
    Login
  </Link>
</p>

        </form>
      </div>
    </div>
  );
};

export default Register;

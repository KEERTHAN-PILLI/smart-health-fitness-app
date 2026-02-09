import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    code: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        email: form.email,
        code: form.code,
        newPassword: form.password,
      });

      alert("Password reset successful");
      navigate("/login");
    } catch {
      alert("Invalid or expired code");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset Password</h2>

      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="code" placeholder="Reset Code" onChange={handleChange} />
      <input
        type="password"
        name="password"
        placeholder="New Password"
        onChange={handleChange}
      />
      <input
        type="password"
        name="confirm"
        placeholder="Confirm Password"
        onChange={handleChange}
      />

      <button>Reset Password</button>
    </form>
  );
};

export default ResetPassword;

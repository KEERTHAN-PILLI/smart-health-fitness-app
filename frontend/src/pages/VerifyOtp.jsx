import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import "../styles/auth.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Email missing. Please retry forgot password.");
      navigate("/forgot-password");
      return;
    }

    try {
      await api.post("/auth/verify-otp", { email, otp });
      alert("OTP verified");
      navigate("/reset-password", { state: { email, otp } });
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Enter OTP</h2>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button type="submit">Verify OTP</button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;

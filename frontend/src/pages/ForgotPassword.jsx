import { useState } from "react";
import api from "../api/axios";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // STEP 1: Send OTP
  const sendCode = async () => {
    try {
      await api.post("/auth/forgot-password", { email });
      alert("OTP sent to your email");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    }
  };

  // STEP 2: Verify OTP
  const verifyOtp = async () => {
    try {
      await api.post("/auth/verify-otp", { email, otp });
      alert("OTP verified");
      setStep(3);
    } catch {
      alert("Invalid or expired OTP");
    }
  };

  // STEP 3: Reset password
  const resetPassword = async () => {
    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await api.post("/auth/reset-password", {
        email,
        password,
      });

      alert("Password reset successful");
      navigate("/login");
    } catch {
      alert("Error resetting password");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={sendCode}>Send Code</button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOtp}>Verify OTP</button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={resetPassword}>Reset Password</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

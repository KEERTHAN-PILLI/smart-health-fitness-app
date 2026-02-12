import { useState } from 'react';
import api from '../api/axios';
import '../styles/auth.css';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordSupabase = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // STEP 1: Send OTP
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || email.trim() === '') {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccess(response.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp || otp.trim() === '') {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      setSuccess(response.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/reset-password', {
        email,
        password,
        otp,
      });
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Your Password</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={handleBackToLogin}
            >
              Back to Login
            </button>
          </form>
        )}

        {/* STEP 2: Verify OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <p className="info-text">
              A reset code has been sent to <strong>{email}</strong>
            </p>
            <div className="form-group">
              <label htmlFor="otp">Enter Reset Code</label>
              <input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                maxLength="6"
                disabled={loading}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setStep(1);
                setError('');
                setSuccess('');
              }}
              disabled={loading}
            >
              Back
            </button>
          </form>
        )}

        {/* STEP 3: Set New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <p className="info-text">Enter your new password below</p>
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter new password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setStep(2);
                setError('');
                setSuccess('');
              }}
              disabled={loading}
            >
              Back
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>
            Remember your password?{' '}
            <button
              className="link-btn"
              onClick={handleBackToLogin}
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordSupabase;

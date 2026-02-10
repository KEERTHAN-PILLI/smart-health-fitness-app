import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfileSetup from "./pages/ProfileSetup";
import ProtectedRoute from "./components/ProtectedRoute";
import UserDashboard from "./pages/UserDashboard";
import TrainerDashboard from "./pages/TrainerDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />


      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileSetup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute role="USER">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trainer-dashboard"
        element={
          <ProtectedRoute role="TRAINER">
            <TrainerDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;

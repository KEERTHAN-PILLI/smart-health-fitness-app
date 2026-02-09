import { useState } from "react";
import api from "../api/axios";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [profile, setProfile] = useState({
    age: "",
    weight: "",
    fitnessGoal: "",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await api.post("/profile", profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile saved successfully ✅");

      // ✅ Redirect based on role
      if (role === "TRAINER") {
        navigate("/trainer-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      alert("Failed to save profile ❌");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Profile Setup</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="age"
            type="number"
            placeholder="Age"
            value={profile.age}
            onChange={handleChange}
            required
          />

          <input
            name="weight"
            type="number"
            placeholder="Weight (kg)"
            value={profile.weight}
            onChange={handleChange}
            required
          />

          <input
            name="fitnessGoal"
            placeholder="Fitness Goal"
            value={profile.fitnessGoal}
            onChange={handleChange}
            required
          />

          <button type="submit">Save Profile</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;

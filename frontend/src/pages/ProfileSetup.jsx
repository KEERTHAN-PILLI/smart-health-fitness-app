import { useState } from "react";
import api from "../api/axios";
import "../styles/auth.css";

const ProfileSetup = () => {
  const [profile, setProfile] = useState({
    age: "",
    weight: "",
    fitnessGoal: "",
  });

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await api.post("/profile", profile);
      alert("Profile saved successfully");
    } catch (err) {
      alert("Failed to save profile");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Profile Setup</h2>

        <input
          name="age"
          type="number"
          placeholder="Age"
          onChange={handleChange}
        />

        <input
          name="weight"
          type="number"
          placeholder="Weight (kg)"
          onChange={handleChange}
        />

        <input
          name="fitnessGoal"
          placeholder="Fitness Goal"
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>Save Profile</button>
      </div>
    </div>
  );
};

export default ProfileSetup;

import db from "../config/db.js";

export const saveProfile = (req, res) => {
  const { age, weight, fitnessGoal } = req.body;
  const userId = req.user.id;

  db.execute(
    "INSERT INTO user_profiles (user_id, age, weight, fitness_goal) VALUES (?, ?, ?, ?)",
    [userId, age, weight, fitnessGoal],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Profile save failed" });
      }
      res.json({ message: "Profile saved successfully" });
    }
  );
};

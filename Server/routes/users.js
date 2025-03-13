const express = require("express"); // Import express
const router = express.Router(); // Create express app
const bcrypt = require("bcrypt");
require("dotenv").config();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const {
  router: authRouter,
  jwtValidate,
  otpValidate,
  getUserIDbyusername,
  getUserIDbyemail,
} = require("./auth");
const db = require("./db");
const e = require("express");

router.get("/", jwtValidate, (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log("Error from .get/ from SELECT * FROM users");
      console.log("Database query failed");
      console.log("Error:", err);
      return res.status(500).json({
        message: "Database query failed",
        error: err.message,
        success: false,
      });
    }

    console.log("Users Retrieved");
    return res.status(200).json(result);
  });
});

router.post("/forgotpwd", otpValidate, (req, res) => {
  const { password } = req.body;

  console.log("DATA:", password);

  if (password.length < 8) {
    console.log("Error from /forgotpwd from password.length < 8");
    console.log("Password must be at least 8 characters");
    return res.status(400).json({
      message: "Password must be at least 8 characters",
      success: false,
    });
  }

  if (req.user.otpValidate) {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.log(
          "Error from /forgotpwd from bcrypt.hash(password, 10, (err, hash)"
        );
        console.log("Error:", err);
        return res.status(500).json({
          message: "Password hashing failed",
          error: err.message,
          success: false,
        });
      }

      db.query(
        "UPDATE users SET password = ? WHERE email = ?",
        [hash, req.user.email],
        (err, result) => {
          if (err) {
            console.log(
              "Error from /forgotpwd from UPDATE users SET password = ? WHERE email = ?"
            );
            console.log("Database query failed");
            console.log("Error:", err);
            return res.status(500).json({
              message: "Database query failed",
              error: err.message,
              success: false,
            });
          }

          if (result.length === 0) {
            console.log("Error from /forgotpwd from result.length === 0");
            console.log("User not found");
            return res
              .status(404)
              .json({ message: "User not found", success: false });
          }

          req.user.otpValidate = false;

          console.log("Password Changed");
          return res
            .status(200)
            .json({ message: "Password Changed", success: true });
        }
      );
    });
  } else {
    console.log("Error from /forgotpwd from req.user.otpValidate");
    console.log("OTP not validated");
    return res
      .status(400)
      .json({ message: "Cannot validate OTP", success: false });
  }
});

router.put("/user/setting/:id", jwtValidate, (req, res) => {
  const userId = parseInt(req.params.id, 10);

  // Check if user is authorized
  if (req.user.UserID !== userId) {
    return res
      .status(403)
      .json({ message: "Unauthorized user", success: false });
  }

  // Extract the settingList from request body
  const { settingList } = req.body;

  // Ensure settingList exists and is an object
  if (!settingList || typeof settingList !== "object") {
    return res
      .status(400)
      .json({ message: "Invalid settings data", success: false });
  }

  // ✅ Ensure settingList contains valid keys from the table
  const allowedKeys = [
    "money_overuse",
    "spending_alert",
    "saving_goal_alert",
    "monthly_summary",
    "debt_payment_reminder",
    "sound_notification",
    "vibration_shaking",
  ];

  const updateFields = [];
  const values = [];

  for (const [key, value] of Object.entries(settingList)) {
    if (allowedKeys.includes(key)) {
      updateFields.push(`${key} = ?`);
      values.push(value ? 1 : 0); // Convert boolean to 1 or 0
    }
  }

  if (updateFields.length === 0) {
    return res
      .status(400)
      .json({ message: "No valid settings provided", success: false });
  }

  values.push(userId); // Add user_id for WHERE condition

  const query = `
        UPDATE user_setting 
        SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?;
    `;

  db.query(query, values, (err, result) => {
    if (err) {
      console.log("Database query failed:", err);
      return res.status(500).json({
        message: "Database query failed",
        error: err.message,
        success: false,
      });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    return res
      .status(200)
      .json({ message: "User settings updated", success: true });
  });
});

router.get("/:id", jwtValidate, (req, res) => {
  //user_id
  console.log("User ID:", req.params.id);

  if (req.user.UserID !== parseInt(req.params.id, 10)) {
    //user_id
    console.log("Unauthorized user");
    return res
      .status(403)
      .json({ message: "Unauthorized user", success: false });
  }

  db.query(
    "SELECT * FROM users WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(
          "Error from .get/:id from SELECT * FROM users WHERE id = ?"
        );
        console.log("Database query failed");
        console.log("Error:", err);
        return res.status(500).json({
          message: "Database query failed",
          error: err.message,
          success: false,
        });
      }

      if (result.length === 0) {
        console.log("From .get/:id from result.length === 0");
        console.log("User not found");
        return res
          .status(404)
          .json({ message: "User not found", success: false });
      }

      console.log("Get User");
      return res
        .status(200)
        .json({ result, message: "Get User", success: true });
    }
  );
});

router.get("/user/setting/:id", jwtValidate, (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (!userId) {
    return res.status(400).json({ message: "Invalid user ID", success: false });
  }

  // ✅ Select only the required fields
  const query = `
      SELECT 
        money_overuse,
        spending_alert,
        saving_goal_alert,
        monthly_summary,
        debt_payment_reminder,
        sound_notification,
        vibration_shaking
      FROM user_setting WHERE user_id = ?
    `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database query failed",
        error: err.message,
        success: false,
      });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No settings found", success: false });
    }

    return res.status(200).json({ success: true, result: results[0] });
  });
});

router.put("/:id", jwtValidate, (req, res) => {
  //user_id
  console.log("User ID:", req.params.id);

  if (req.user.UserID !== parseInt(req.params.id, 10)) {
    //user_id
    console.log("Unauthorized user");
    return res
      .status(403)
      .json({ message: "Unauthorized user", success: false });
  }

  if (req.body.id || req.body.password || req.body.email) {
    console.log(
      "Error from .put/:id from req.body.id || req.body.password || req.body.email"
    );
    console.log("Can not change!");
    return res.status(400).json({ message: "Can not change!", success: false });
  } else {
    db.query(
      "UPDATE users SET ? WHERE id = ?",
      [req.body, req.params.id],
      (err, result) => {
        if (err) {
          console.log(
            "Error from .put/:id from UPDATE users SET ? WHERE id = ?"
          );
          console.log("Database query failed");
          console.log("Error:", err);
          return res.status(500).json({
            message: "Database query failed",
            error: err.message,
            success: false,
          });
        }

        if (result.length === 0) {
          console.log("From .put/:id from result.length === 0");
          console.log("User not found");
          return res
            .status(404)
            .json({ message: "User not found", success: false });
        }

        console.log("User updated");
        return res.status(200).json({ message: "User updated", success: true });
      }
    );
  }
});

router.delete("/:id", jwtValidate, (req, res) => {
  //user_id
  console.log("User ID:", req.params.id);

  if (req.user.UserID !== parseInt(req.params.id, 10)) {
    //user_id
    console.log("Unauthorized user");
    return res
      .status(403)
      .json({ message: "Unauthorized user", success: false });
  }

  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err, result) => {
    if (err) {
      console.log("Error from .delete/:id from DELETE FROM users WHERE id = ?");
      console.log("Database query failed");
      console.log("Error:", err);
      return res.status(500).json({
        message: "Database query failed",
        error: err.message,
        success: false,
      });
    }

    if (result.length === 0) {
      console.log("From .delete/:id from result.length === 0");
      console.log("User not found");
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    console.log("User deleted");
    res.status(200).json({ message: "User deleted", success: true });
  });
});

// 📡 Get User Details Route
router.get("/userdetail/:id", jwtValidate, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (!userId) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  const query = `
    SELECT *
    FROM users 
    WHERE id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.log("❌ Database Query Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database query failed",
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: results[0] });
  });
});

router.put("/user/:id", jwtValidate, async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { user_name, name, user_email, birth_date, gender, bio } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  // Prevent updating protected fields
  if (req.body.id) {
    return res
      .status(400)
      .json({ success: false, message: "Cannot update user ID!" });
  }

  try {
    const query = `
      UPDATE users 
      SET user_name = ?, name = ?, user_email = ?, birth_date = ?, gender = ?, bio = ?
      WHERE id = ?
    `;
    db.query(
      query,
      [user_name, name, user_email, birth_date, gender, bio, userId],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Database update failed",
            error: err.message,
          });
        }

        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
          success: true,
          message: "User details updated successfully",
        });
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

router.put("/userdetail/:id", jwtValidate, async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { user_name, name, email, birth_date, gender, bio, profile_url } = req.body;

  console.log("User ID:", userId);
  console.log("User Name:", user_name);
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Birth Date:", birth_date);
  console.log("gender", gender);
  console.log("bio", bio);
  console.log("profile_url", profile_url);

  if (!userId) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  // Prevent updating protected fields
  if (req.body.id) {
    return res
      .status(400)
      .json({ success: false, message: "Cannot update user ID!" });
  }

  try {
    const query = `
      UPDATE users 
      SET username = ?, name = ?, email = ?, birthday = ?, gender = ?, bio = ?, profile_url = ? 
      WHERE id = ?
    `;

    db.query(
      query,
      [user_name, name, email, birth_date, gender, bio, profile_url, userId], // Ensure correct variables are passed
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Database update failed",
            error: err.message,
          });
        }

        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
          success: true,
          message: "User details updated successfully",
        });
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = {
  router,
};

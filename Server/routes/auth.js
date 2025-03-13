const express = require("express"); // Import express
const router = express.Router(); // Create express app
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token generation
const otpGenerator = require("otp-generator"); // Import otp-generator for OTP generation
const axios = require('axios');
require("dotenv").config(); // Import dotenv for environment variables

const db = require("./db");
const { sendEmail } = require("./sendEmail");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const getUserIDbyusername = (username) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id FROM users WHERE username = ?",
      [username],
      (err, result) => {
        if (err) {
          return reject(new Error("Database query failed"));
        }

        if (result.length === 0) {
          return reject(new Error("User not found"));
        }

        resolve(result[0].id);
      }
    );
  });
};

const getUserIDbyemail = (email) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT id FROM users WHERE email = ?", [email], (err, result) => {
      if (err) {
        return reject(new Error("Database query failed"));
      }

      if (result.length === 0) {
        return reject(new Error("Email not found"));
      }

      resolve(result[0].id);
    });
  });
};

const jwtAccessTokenGenrate = (UserID, username, email) => {
  const accessToken = jwt.sign(
    { UserID, username, email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30m", algorithm: "HS256" }
  );

  return accessToken;
};

const jwtValidate = (req, res, next) => {
  try {
    if (!req.headers["authorization"]) {
      console.log("No token provided");
      return res
        .status(401)
        .json({ message: "No token provided", success: false });
    }

    const token = req.headers["authorization"].replace("Bearer ", "");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log("Invalid token:", err.message);
        return res
          .status(403)
          .json({ message: `Invalid token: ${err.message}`, success: false });
      }

      console.log("Decoded JWT:", decoded);

      req.user = {
        UserID: decoded.UserID,
        username: decoded.username,
        email: decoded.email,
      };

      req.userToken = token;

      next();
    });
  } catch (err) {
    console.log("Unexpected error:", err.message);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

const otpValidate = (req, res, next) => {
  try {
    if (!req.headers["otp"]) {
      console.log("No otp provided");
      return res
        .status(401)
        .json({ message: `No otp provided`, success: false });
    }

    const otp = req.headers["otp"];
    const email = req.headers["email"];

    db.query("SELECT * FROM otp WHERE email = ?", [email], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Database query failed",
          error: err.message,
          success: false,
        });
      }

      const otpData = result[0];

      if (otpData.otp_code === otp) {
        if (otpData.expires_at < new Date()) {
          return res
            .status(400)
            .json({ message: "OTP expired", success: false });
        } else {
          req.user = {
            email: email,
            otpValidate: true,
          };
          next();
        }
      } else {
        return res
          .status(400)
          .json({ message: "Invalid OTP or OTP is used", success: false });
      }
    });
  } catch (err) {
    console.log("Unexpected error:", err.message);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

router.post("/register", (req, res) => {
  const { username, email, password, password2, otp } = req.body;

  console.log("DATA:", username, email, password, password2, otp);

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    console.log("From /register from !usernameRegex.test(username)");
    console.log("Username cannot contain whitespace or special characters");
    return res.status(400).json({
      message: "Username cannot contain whitespace or special characters",
      success: false,
    });
  }

  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (!emailRegex.test(`${email}`)) {
    console.log("From /register from !emailRegex.test(`${email}`)");
    console.log("Invalid email format");
    return res
      .status(400)
      .json({ message: "Invalid email format", success: false });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, result) => {
      if (err) {
        console.log("Error from /register from SELECT * FROM users WHERE username = ?");
        console.log("Database query failed");
        console.log("Error:", err);
        return res.status(500).json({
          message: "Database query failed",
          error: err.message,
          success: false,
        });
      }

      if (result.length > 0) {
        console.log("Error from /register from SELECT * FROM users WHERE username = ?");
        console.log("Username already exists");
        return res
          .status(409)
          .json({ message: "Username already exists", success: false });
      }

      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, result) => {
          if (err) {
            console.log("Error from /register from SELECT * FROM users WHERE email = ?");
            console.log("Database query failed");
            console.log("Error:", err);
            return res.status(500).json({
              message: "Database query failed",
              error: err.message,
              success: false,
            });
          }

          if (result.length > 0) {
            console.log("Error from /register from SELECT * FROM users WHERE email = ?");
            console.log("Email already exists");
            return res
              .status(409)
              .json({ message: "Email already exists", success: false });
          }

          if (password.length < 8) {
            console.log("From /register from password.length < 8");
            console.log("Password must be at least 8 characters");
            return res.status(400).json({
              message: "Password must be at least 8 characters",
              success: false,
            });
          }

          if (password !== password2) {
            console.log("From /register from password !== password2");
            console.log("Passwords do not match");
            return res
              .status(400)
              .json({ message: "Passwords do not match", success: false });
          }

          db.query(
            "SELECT * FROM otp WHERE email = ?",
            [email],
            async (err, result) => {
              if (err) {
                console.log("From /register from SELECT * FROM otp WHERE email = ?");
                console.log("Database query failed");
                console.log("Error:", err);
                return res.status(500).json({
                  message: "Database query failed",
                  error: err.message,
                  success: false,
                });
              }

              const otpData = result[0];

              // console.log(otp)
              // console.log(otpData.otp_code)

              if (otpData.otp_code === otp) {
                if (otpData.expires_at < new Date()) {
                  console.log("From /register from otpData.otp_code === otp");
                  console.log("In case otpData.expires_at < new Date()");
                  console.log("OTP expired");
                  return res
                    .status(400)
                    .json({ message: "OTP expired", success: false });
                } else {
                  console.log("From /register from otpData.otp_code === otp");
                  console.log("In case NOT otpData.expires_at < new Date()");
                  console.log("OTP verified");
                  bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                      console.log("Error hashing password", err);
                      return res.status(500).json({
                        message: "Password hashing failed",
                        error: err.message,
                        success: false,
                      });
                    }

                    db.query(
                      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                      [username, email, hash],
                      async (err, result) => {
                        if (err) {
                          console.log("From /register from INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
                          console.log(username, email, hash);
                          console.log("Database query failed");
                          console.log("Error:", err);
                          return res.status(500).json({
                            message: "Database query failed",
                            error: err.message,
                            success: false,
                          });
                        }

                        const UserID = await getUserIDbyusername(username);

                        console.log(UserID, username, email);

                        db.query(
                          "INSERT INTO user_setting (user_id) VALUES (?)",
                          [UserID],
                          async (err, result) => {
                            if (err) {
                              console.log("From /register from INSERT INTO user_setting (user_id) VALUES (?)");
                              console.log("Error inserting user settings");
                              console.log("Error:", err);
                              return res.status(500).json({
                                message: "Failed to insert user settings",
                                error: err.message,
                                success: false,
                              });
                            }

                            console.log("User settings created");
                            const accessToken = jwtAccessTokenGenrate(
                              UserID,
                              username,
                              email
                            );

                            try {
                              const response = await axios.post(
                                "http://localhost:3000/devices/create",
                                { user_id: UserID },
                                {
                                  headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                    "Content-Type": "application/json",
                                  },
                                }
                              );
                              console.log("Device registered:", response.data);
                            } catch (error) {
                              console.log("Failed to register device:", error.message);
                            }

                            console.log("User created");
                            return res.status(201).json({
                              accessToken,
                              message: "User created successfully",
                              success: true,
                            });
                          }
                        );
                      }
                    );
                  });
                }
              } else {
                console.log("From /register from NOT otpData.otp_code === otp");
                console.log("Invalid OTP");
                return res
                  .status(400)
                  .json({ message: "Invalid OTP", success: false });
              }
            }
          );
        }
      );
    }
  );
});

router.post("/login", (req, res) => {
  const { input, password } = req.body;
  let userOrEmail = "username";

  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (emailRegex.test(`${input}`)) {
    userOrEmail = "email";
  }

  console.log("DATA:", input, password);
  console.log("Input Type:", userOrEmail);

  //console.log(`SELECT * FROM users WHERE ${userOrEmail} = ?`, [input]);

  db.query(
    `SELECT * FROM users WHERE ${userOrEmail} = ?`,
    [input],
    (err, result) => {
      if (err) {
        console.log("From /login from SELECT * FROM users WHERE ${userOrEmail} = ?");
        console.log("Database query failed");
        console.log("Error:", err);
        return res.status(500).json({
          message: "Database query failed",
          error: err.message,
          success: false,
        });
      }

      if (result.length === 0) {
        console.log("From /login from result.length === 0");
        console.log("User or Email not found");
        return res
          .status(404)
          .json({ message: "User or Email not found", success: false });
      }

      const user = result[0];
      console.log("User Data: ");
      console.log(user)

      bcrypt.compare(password, user.password, async (err, match) => {
        if (err) {
          console.log("From /login from SELECT * FROM users WHERE ${userOrEmail} = ?");
          console.log("Password comparison failed")
          console.log("Error:", err);
          return res.status(500).json({
            message: "Password comparison failed",
            error: err.message,
            success: false,
          });
        }

        if (!match) {
          console.log("From /login from password NOT match");
          console.log("Invalid password")
          return res
            .status(401)
            .json({ message: "Invalid password", success: false });
        }

        const UserID =
          userOrEmail === "email"
            ? await getUserIDbyemail(input)
            : await getUserIDbyusername(input);

        const accessToken = jwtAccessTokenGenrate(
          UserID,
          user.username,
          user.email
        );
        //console.log(user)UserID

        try {
          const response = await axios.post(
            "http://localhost:3000/devices/create",
            { user_id: UserID },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Device registered:", response.data);
        } catch (error) {
          console.log("Failed to register device:", error.message);
        }

        console.log("Login successful")
        return res
          .status(200)
          .json({ accessToken, message: "Login successful", success: true });
      });
    }
  );
});

router.post("/otpSend", (req, res) => {
  const { email } = req.body;

  console.log("DATA:", email);

  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (!emailRegex.test(email)) {
    console.log("From /otpSend from !emailRegex.test(email)");
    console.log("Invalid email format");
    return res
      .status(400)
      .json({ message: "Invalid email format", success: false });
  }

  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const created_at = new Date();
  const expires_at = new Date(Date.now() + 5 * 60 * 1000);

  db.query(
    "SELECT * FROM otp WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        console.log("From /otpSend from SELECT * FROM otp WHERE email = ?");
        console.log("Database query failed")
        console.log("Error:", err);
        return res.status(500).json({
          message: "Database query failed",
          error: err.message,
          sucjwtAccessTokenGenratecess: false,
        });
      }

      try {
        const subject = "Your OTP Code";
        const text = `Your OTP is: ${otp}.`;
        const html = `<p>Your OTP is: <strong>${otp}</strong></p>`;

        const emailResult = await sendEmail({ email, subject, text, html });
        console.log(emailResult);

        if (emailResult.success) {
          console.log("From /otpSend from emailResult.success");
          console.log("OTP sent successfully");
          if (result.length > 0) {
            db.query(
              "UPDATE otp SET otp_code = ?, created_at = ?, expires_at = ?, is_used = 0 WHERE email = ?",
              [otp, created_at, expires_at, email],
              (err) => {
                if (err) {
                  console.log("result.length > 0");
                  console.log("From /otpSend from UPDATE otp SET otp_code = ?, created_at = ?, expires_at = ?, is_used = 0 WHERE email = ?");
                  console.log("Database update failed");
                  console.log("Error:", err);
                  return res.status(500).json({
                    message: "Database update failed",
                    error: err.message,
                    success: false,
                  });
                }

                console.log("OTP resent successfully");
                return res
                  .status(200)
                  .json({ message: "OTP resent successfully", success: true });
              }
            );
          } else {
            db.query(
              "INSERT INTO otp (email, otp_code, created_at, expires_at) VALUES (?, ?, ?, ?)",
              [email, otp, created_at, expires_at],
              (err) => {
                if (err) {
                  console.log("in NOT result.length > 0");
                  console.log("From /otpSend from INSERT INTO otp (email, otp_code, created_at, expires_at) VALUES (?, ?, ?, ?)");
                  console.log("Database insert failed");
                  console.log("Error:", err);
                  return res.status(500).json({
                    message: "Database insert failed",
                    error: err.message,
                    success: false,
                  });
                }

                console.log("OTP create and sent successfully");
                return res
                  .status(200)
                  .json({ message: "OTP create and sent successfully", success: true });
              }
            );
          }
        } else {
          console.log("From /otpSend from NOT emailResult.success");
          console.log("Failed to send OTP email");
          return res
            .status(500)
            .json({ message: "Failed to send OTP email", success: false });
        }
      } catch (error) {
        console.log("In Catch Block")
        console.log("Error sending OTP email");
        console.log("Error:", error);
        return res.status(500).json({
          message: "Failed to send OTP email",
          error: error.message,
          success: false,
        });
      }
    }
  );
});

router.post("/otpVerify", (req, res) => {
  const { email, otp } = req.body;

  db.query("SELECT * FROM otp WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.log("From /otpVerify from SELECT * FROM otp WHERE email = ?");
      console.log("Database query failed");
      console.log("Error:", err);
      return res.status(500).json({
        message: "Database query failed",
        error: err.message,
        success: false,
      });
    }

    const otpData = result[0];

    if (otpData.otp_code === otp && otpData.is_used === 0) {
      if (otpData.expires_at < new Date()) {
        console.log("From /otpVerify from otpData.expires_at < new Date()");
        console.log("OTP expired");
        return res.status(400).json({ message: "OTP expired", success: false });
      } else {
        db.query(
          "UPDATE otp SET is_used = 1 where email = ?",
          [email],
          (err, result) => {
            if (err) {
              console.log("From /otpVerify from UPDATE otp SET is_used = 1 where email = ?");
              console.log("Database query failed");
              console.log("Error:", err);
              return res.status(500).json({
                message: "Database query failed",
                error: err.message,
                success: false,
              });
            }

            console.log("OTP verified");
            return res
              .status(200)
              .json({ message: "OTP verified", success: true });
          }
        );
      }
    } else {
      console.log("From /otpVerify from NOT otpData.otp_code === otp");
      console.log("Invalid OTP or OTP is used");
      return res
        .status(400)
        .json({ message: "Invalid OTP or OTP is used", success: false });
    }
  });
});

router.put("/createpin", jwtValidate, async (req, res) => {
  try {
    const { user_id, pin } = req.body;

    console.log("DATA:", user_id, pin);

    if (req.user.UserID !== parseInt(user_id, 10)) {
      console.log("From /createpin from req.user.UserID !== parseInt(user_id, 10)");
      console.log("Unauthorized user");
      return res
        .status(403)
        .json({ message: "Unauthorized user", success: false });
    }

    if (!user_id || !pin) {
      console.log("From /createpin from !user_id || !pin");
      console.log("Please fill all needed fields");
      return res
        .status(400)
        .json({ message: "Please fill all needed fields", success: false });
    }

    console.log("Decoded JWT UserID:", req.user.UserID);
    console.log("Received user_id:", user_id, "Parsed:", parseInt(user_id, 10));

    const result = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE users SET pin = ? WHERE id = ?",
        [pin, user_id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    if (result.affectedRows === 0) {
      console.log("From /createpin from result.affectedRows === 0");
      console.log("User not found");
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    console.log("Pin created");
    return res.status(200).json({ message: "Pin updated", success: true });
  } catch (error) {
    console.log("In Catch Block")
    console.log("Error updating PIN");
    console.log("Error:", error);
    return res.status(500).json({
      message: "Database query failed",
      error: error.message,
      success: false,
    });
  }
});

router.get("/getpin/:userID", jwtValidate, async (req, res) => {
  const { userID } = req.params;

  console.log("User ID from getPin: ", userID);

  if (req.user.UserID !== parseInt(userID)) { //user_id
    console.log("From /getpin from req.user.UserID !== parseInt(userID)");
    console.log("Unauthorized user");
    return res.status(403).json({ message: 'Unauthorized user', success: false });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      db.query("SELECT pin FROM users WHERE id = ?", [userID], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    console.log("Result: ", result);

    if (result.length === 0) {
      console.log("From /getpin from result.length === 0");
      console.log("User not found");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("Pin retrieved");
    return res.json({ success: true, pin: result[0].pin, message: "Pin retrieved" });
  } catch (err) {
    console.log("In Catch Block")
    console.log("Error retrieving PIN");
    console.log("Erorr: ", err);
    return res.status(500).json({
      success: false,
      message: "Database error",
      error: err.message,
    });
  }
});

module.exports = {
  router,
  jwtValidate,
  otpValidate,
  getUserIDbyusername,
  getUserIDbyemail,
};

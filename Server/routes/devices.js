const express = require("express"); // Import express
const router = express.Router(); // Create express app
require("dotenv").config();
const useragent = require("express-useragent"); // Install: npm install express-useragent
const axios = require("axios"); // Install: npm install axios

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(useragent.express()); // Middleware to parse user-agent

const {
  router: authRouter,
  jwtValidate,
  getUserIDbyusername,
  getUserIDbyemail,
} = require("./auth");
const db = require("./db");

router.post("/create", jwtValidate, async (req, res) => {
  try {
    const { user_id } = req.body;

    // Extract device name from User-Agent
    const device_name = req.useragent.platform + " - " + req.useragent.browser;

    // Extract IP address from request
    const ip_address =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Get location from IP using an external API
    let location = null;
    const geoResponse = await axios.get(`http://ip-api.com/json/${ip_address}`);

    if (geoResponse.data && geoResponse.data.status === "success") {
      location = `${geoResponse.data.city}, ${geoResponse.data.country}`;
    } else {
      location = "Unknown";
    }

    const token = req.userToken;

    console.log("User ID:", user_id);
    console.log("Device Name:", device_name);
    console.log("IP Address:", ip_address);
    console.log("Location:", location);
    console.log("Token:", token);

    if (req.user.UserID !== parseInt(user_id, 10)) {
      //user_id
      return res
        .status(403)
        .json({ message: "Unauthorized user", success: false });
    }

    if (!user_id || !device_name || !ip_address || !token) {
      return res
        .status(400)
        .json({ message: "Please fill all needed fields", success: false });
    }

    db.query(
      "SELECT * FROM devices WHERE token = ? AND user_id = ? LIMIT 1",
      [token, user_id],
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({
              message: "Database query failed",
              error: err.message,
              success: false,
            });
        }

        if (results.length > 0) {
          // Device exists, update last_login timestamp
          db.query(
            "UPDATE devices SET last_login = NOW() WHERE token = ?",
            [token],
            (updateErr) => {
              if (updateErr) {
                return res
                  .status(500)
                  .json({
                    message: "Failed to update last login",
                    error: updateErr.message,
                    success: false,
                  });
              }

              console.log("Device last login updated");
              return res
                .status(200)
                .json({ message: "Device last login updated", success: true });
            }
          );
        } else {
          // Device does not exist, insert new record
          db.query(
            "INSERT INTO devices (user_id, device_name, ip_address, location, token, last_login) VALUES (?, ?, ?, ?, ?, NOW())",
            [user_id, device_name, ip_address, location, token],
            (insertErr, result) => {
              if (insertErr) {
                return res
                  .status(500)
                  .json({
                    message: "Database query failed",
                    error: insertErr.message,
                    success: false,
                  });
              }

              console.log("Device Created");
              return res
                .status(201)
                .json({ result, message: "Device Created", success: true });
            }
          );
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
});

router.get("/:id", jwtValidate, (req, res) => {
  if (req.user.UserID !== parseInt(req.params.id, 10)) {
    //user_id
    return res
      .status(403)
      .json({ message: "Unauthorized user", success: false });
  }

  db.query(
    "SELECT * FROM devices WHERE user_id = ?",
    [req.params.id],
    (err, result) => {
      //user_id
      if (err) {
        return res
          .status(500)
          .json({
            message: "Database query failed",
            error: err.message,
            success: false,
          });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "devices not found", success: false });
      }

      return res.status(200).json({ result, success: true });
    }
  );
});

// router.put('/:id', jwtValidate,(req, res) => {
//     if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
//         return res.status(403).json({ message: 'Unauthorized user', success: false });
//     }

//     db.query(
//         'UPDATE devices SET ? WHERE id = ?', [req.body, req.params.id], (err, result) => { //noti_id
//             if (err) {
//                 return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
//             }

//             if (result.length === 0) {
//                 return res.status(404).json({ message: 'Device not found', success: false });
//             }

//             return res.status(200).json({ message: 'Device updated', success: true });
//         }
//     )
// })

router.delete("/:id", jwtValidate, (req, res) => {
  const { user_id } = req.body;

  if (req.user.UserID !== parseInt(user_id, 10)) {
    //user_id
    return res
      .status(403)
      .json({ message: "Unauthorized user", success: false });
  }

  db.query(
    "DELETE FROM devices WHERE id = ?",
    [req.params.id],
    (err, result) => {
      //noti_id
      if (err) {
        return res
          .status(500)
          .json({
            message: "Database query failed",
            error: err.message,
            success: false,
          });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "Device not found", success: false });
      }

      res.status(200).json({ message: "Device signed out", success: true });
    }
  );
});

router.delete("/user/:id", jwtValidate, (req, res) => {
  const { device_id } = req.body;

  if (req.user.UserID !== parseInt(req.params.id, 10)) {
    //user_id
    return res
      .status(403)
      .json({ message: "Unauthorized user", success: false });
  }

  db.query("SELECT * FROM devices WHERE id = ?", [device_id], (err, result) => {
    //noti_id
    if (err) {
      return res
        .status(500)
        .json({
          message: "Database query failed",
          error: err.message,
          success: false,
        });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "Device not found", success: false });
    }

    db.query(
      "DELETE FROM devices WHERE user_id = ? AND id != ?",
      [req.params.id, device_id],
      (err, result) => {
        //noti_id
        if (err) {
          return res
            .status(500)
            .json({
              message: "Database query failed",
              error: err.message,
              success: false,
            });
        }

        if (result.length === 0) {
          return res
            .status(404)
            .json({ message: "Device not found", success: false });
        }

        res
          .status(200)
          .json({
            message: "Signed out from all other devices",
            success: true,
          });
      }
    );
  });
});

module.exports = {
  router,
};

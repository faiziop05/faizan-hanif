const { readData, saveData } = require("../utils/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password.." });
    }

    const allUsers = readData("users");

    const userIndex = allUsers.findIndex((e) => e.email === email);

    if (userIndex === -1) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const user = allUsers[userIndex];

    const MAX_ATTEMPTS = 5;
    const LOCK_TIME_MS = 15 * 60 * 1000; 

    if (user.lockUntil && user.lockUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(403).json({
        message: `Account temporarily locked. Try again in ${minutesLeft} minutes.`,
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME_MS;
      }
      allUsers[userIndex] = user;
      saveData("users", allUsers);

      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    allUsers[userIndex] = user;
    saveData("users", allUsers);

    const Payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(Payload, process.env.JWT_KEY, {
      expiresIn: "15m",
    });

    return res.status(200).json({
      email: user.email,
      role: user.role,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};


const refreshAuthToken = async (req, res) => {
  try {
    const { id, email, role } = req.user;

    const newPayload = { id, email, role };

    const newToken = jwt.sign(newPayload, process.env.JWT_KEY, {
      expiresIn: "15m",
    });

    return res.status(200).json({
      message: "Token refreshed successfully",
      token: newToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { LoginUser, refreshAuthToken };


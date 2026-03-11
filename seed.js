const bcrypt = require("bcrypt");
const { readData, saveData } = require("./utils/database");

const registerUser = async (req) => {
  try {
    const { email, password, role } = req;

    const hashedPassword = await bcrypt.hash(password, 10);
    const allUsers = readData("users");

    if (allUsers.some((e) => e.email == email))
      return console.log("User already exists!!");

    const newUser = {
      id: Date.now(),
      email,
      password: hashedPassword,
      role: role,
      failedLoginAttempts: 0,
      lockUntil: null,
    };

    allUsers.push(newUser);

    console.log("user cerated");

    saveData("users", allUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

registerUser({
  email: "admin@yqnpay.com",
  password: "admin123",
  role: "admin",
});

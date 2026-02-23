exports.login = async (req, res) => {
  console.log("LOGIN HIT");

  try {
    const { username, password } = req.body;

    console.log("BODY:", req.body);

    const Admin = require("../models/Admin");
    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");

    const admin = await Admin.findOne({ username });

    console.log("ADMIN:", admin);

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET
    );

    res.json({ success: true, token });

  } catch (err) {
    console.error("LOGIN CRASH:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

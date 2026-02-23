


exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const Admin = require("../models/Admin");
    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    if (!admin.password) {
      return res.status(500).json({ message: "Admin password missing" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      admin: { username: admin.username }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};


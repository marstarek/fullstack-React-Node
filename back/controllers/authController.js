// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

const JWT_SECRET = "supersecret";

// ✅ Signup
export async function signup(req, res) {
  const { name, username, email, phone, password } = req.body;

  // Simple validation
  if (!name || !username || !email || !phone || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // check if user exists by email or username
    const [existing] = await db.execute(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.execute(
      "INSERT INTO users (name, username, email, phone, password) VALUES (?, ?, ?, ?, ?)",
      [name, username, email, phone, hashed]
    );

    res.json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// ✅ Login
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.status(400).json({ error: "Invalid email" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid password" });

    // include more info in token if needed
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login success",
      token,
      user: { id: user.id, name: user.name, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// ✅ Profile
export function profile(req, res) {
  res.json({ message: "Profile data", user: req.user });
}
// ✅ Return Authenticated User Data
export async function authUserData(req, res) {
  try {
    const userId = req.user.id; // comes from authMiddleware
    const [rows] = await db.execute("SELECT id, name, username, email, phone FROM users WHERE id = ?", [userId]);

    if (!rows.length) return res.status(404).json({ error: "User not found" });

    const user = rows[0];

    // Optionally refresh token here
    const newToken = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Authenticated user",
      user,
      token: newToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

const JWT_SECRET = "supersecret";

// ✅ Signup
export async function signup(req, res) {
  const { name, username, email, phone, password } = req.body;

  if (!name || !username || !email || !phone || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // check if user exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, username, email, phone, password: hashed },
    });

    res.json({ message: "User created successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// ✅ Login
const REFRESH_SECRET = "refresh-secret";

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid email" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid password" });

    // ✅ Create tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET ,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Store refresh token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

  res.json({
  message: "Login success",
  accessToken,
  refreshToken,
  user: { id: user.id, name: user.name, email: user.email, role: user.role },
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
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, username: true, email: true, phone: true , role:true},
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const newToken = jwt.sign(
      { id: user.id, email: user.email, username: user.username , role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Authenticated user",
      user,
      accessToken: newToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

  try {
    // ✅ Find user with this refresh token
    const user = await prisma.user.findFirst({ where: { refreshToken } });
    if (!user) return res.status(403).json({ error: "Invalid refresh token" });

    // ✅ Verify refresh token
    jwt.verify(refreshToken, REFRESH_SECRET);

    // ✅ Issue new access token
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET ,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
}
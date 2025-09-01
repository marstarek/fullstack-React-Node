import jwt from "jsonwebtoken";
const JWT_SECRET = "supersecret";

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user to request
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
}

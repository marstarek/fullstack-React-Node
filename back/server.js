import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/admin.js";
const app = express();
app.use(express.json());
app.use(cors());

// Mount routes
app.use("/", authRoutes);
app.use("/admin", adminRoutes);

app.listen(4000, () => console.log("Server running on port 4000"));

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roles.js";
import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// ✅ Get paginated + searchable users
router.get(
  "/users",
  authMiddleware,
  checkRole("SUPERADMIN"),
  async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      console.log({ page, limit, search, skip });

      // 👇 Remove "mode" so it works on older Prisma
      const where = search
        ? {
            OR: [
              { name: { contains: String(search) } },
              { email: { contains: String(search) } },
            ],
          }
        : {};

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: parseInt(limit),
          select: { id: true, name: true, email: true, role: true ,username:true ,phone:true},
        }),
        prisma.user.count({ where }),
      ]);

      res.json({
        users,
        total,
        page: parseInt(page ),
        limit: parseInt(limit ),
      });
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      res.status(500).json({
        error: "Failed to fetch users",
        details: err.message || err, // return real message
      });
    }
  }
);
router.delete(
  "/users/:id",
  authMiddleware,
  checkRole("SUPERADMIN"),
  async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.user.delete({ where: { id: parseInt(id) } });
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete user", details: err.message });
    }
  }
);
 
router.put(
  "/users/:id",
  authMiddleware,
  checkRole("SUPERADMIN"),
  [
        body("username").notEmpty().withMessage("Username is required"),
   body("phone")
      .notEmpty()
      .withMessage("Phone is required")
      .isMobilePhone("any")
      .withMessage("Invalid phone number"),
    body("name").notEmpty().withMessage("Name is required"),
    body("email")
      .isEmail()
      .withMessage("Valid email is required"),
    body("role")
      .isIn(["USER", "RESTAURANT_ADMIN", "SUPERADMIN"])
      .withMessage("Role must be USER, RESTAURANT_ADMIN, or SUPERADMIN"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email, role ,username,phone} = req.body;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { name, email, role ,username,phone},
        select: { id: true, name: true, email: true, role: true,username:true ,phone:true},
      });

      res.json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to update user", details: err.message });
    }
  }
);

router.post(
  "/users",
  authMiddleware,
  checkRole("SUPERADMIN"),
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone")
      .notEmpty()
      .withMessage("Phone is required")
      .isMobilePhone("any")
      .withMessage("Invalid phone number"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .isIn(["USER", "RESTAURANT_ADMIN", "SUPERADMIN"])
      .withMessage("Invalid role"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, name, email, phone, password, role } = req.body;

      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username,
          name,
          email,
          phone,
          password: hashed,
          role: role || "USER",
        },
      });

      res.json({ message: "✅ User created successfully", user });
    } catch (err) {
      console.error("❌ Error creating user:", err);
      res.status(500).json({
        error: "Failed to create user",
        details: err.message,
      });
    }
  }
);


// ✅ Assign restaurant admin
router.post(
  "/restaurants/:restaurantId/assign-admin/:userId",
  authMiddleware,
  checkRole("SUPERADMIN"),
  async (req, res) => {
    try {
      const { restaurantId, userId } = req.params;

      const user = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          role: "RESTAURANT_ADMIN",
          restaurantId: parseInt(restaurantId),
        },
      });

      res.json({ message: "Admin assigned to restaurant", user });
    } catch (err) {
      console.error("❌ Error assigning admin:", err);
      res.status(500).json({
        error: "Failed to assign admin",
        details: err.message,
      });
    }
  }
);

export default router;

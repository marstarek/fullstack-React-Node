// roles.js
export const checkRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied: insufficient role" });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Server error in role middleware" });
    }
  };
};

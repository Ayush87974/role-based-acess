// middleware/authMiddleware.js
import { verifyToken } from "../utils/auth.js";
import User from "../models/User.js";
import { ROLE_PERMISSIONS } from "../config/roles.js";

/**
 * Authenticate: verifies JWT from Authorization header "Bearer <token>"
 * Attaches user object to req.user (fresh from DB)
 */
export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });
    const token = header.split(" ")[1];
    const payload = verifyToken(token);
    // fetch user from DB and attach (ensures we have latest role/permissions)
    const user = await User.findById(payload.userId).lean();
    if (!user) return res.status(401).json({ message: "Invalid token user" });
    req.user = user;
    next();
  } catch (err) {
    console.error("auth error", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

/**
 * requireRole('Admin') - allow only specified role (or higher if useHierarchy true)
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const userRole = req.user.role;
    if (allowedRoles.includes(userRole)) return next();
    return res.status(403).json({ message: "Forbidden: insufficient role" });
  };
}

/**
 * requirePermission('manage_users')
 * checks: user.permissions (per-user) OR role-based permissions
 */
import { ROLE_PERMISSIONS } from "../config/roles.js";

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    // per-user explicit
    if (Array.isArray(req.user.permissions) && req.user.permissions.includes(permission)) {
      return next();
    }

    // role-derived
    const rolePerms = ROLE_PERMISSIONS[req.user.role] || [];
    if (rolePerms.includes(permission)) return next();

    return res.status(403).json({ message: "Forbidden: missing permission" });
  };
}

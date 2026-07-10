import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "lintas-wahana-jwt-secret-2026";

export function jwtVerifier(req, res, next) {
  const token = req.cookies?.auth_token
    || req.headers.authorization?.replace("Bearer ", "")
    || req.headers["x-auth-token"];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: no token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: invalid or expired token",
    });
  }
}

import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "lintas-wahana-jwt-secret-2026";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const JwtService = {
  sign(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
  },

  verify(token) {
    return jwt.verify(token, SECRET);
  },

  decode(token) {
    return jwt.decode(token);
  },
};

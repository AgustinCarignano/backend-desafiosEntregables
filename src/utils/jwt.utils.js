import jwt from "jsonwebtoken";
import config from "../config.js";

const SECRET_KEY = config.secretOrKey;

export const generateToken = async (obj, expiresIn) => {
  return jwt.sign({ user: obj }, SECRET_KEY, { expiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

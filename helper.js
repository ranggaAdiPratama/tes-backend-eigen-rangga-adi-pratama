import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import RefreshToken from "./models/refreshToken.js";

export const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

export const isPenalized = (date) => {
  const givenDate = new Date(date);

  const currentDate = new Date();

  const differenceInTime = givenDate.getTime() - currentDate.getTime();

  const millisecondsInADay = 1000 * 60 * 60 * 24;
  const differenceInDays = differenceInTime / millisecondsInADay;

  if (differenceInDays < 0) {
    return true;
  } else {
    return false;
  }
};

export const generateToken = (id) => {
  const env = process.env;

  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 * 365,
  });
};

export const generateRefreshToken = async (id) => {
  const token = await RefreshToken.create({
    user: id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return token.token;
};

export const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }

        resolve(hash);
      });
    });
  });
};

function randomTokenString() {
  return crypto.randomBytes(40).toString("hex");
}

export const response = (res, code, message, data = {}) => {
  return res.status(code).json({
    meta: {
      code,
      message,
    },
    data,
  });
};

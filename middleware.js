import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import TokenBlackList from "./models/tokenBlackList.js";
import User from "./models/user.js";
import * as helper from "./helper.js";

export const auth = expressAsyncHandler(async (req, res, next) => {
  const env = process.env;

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const tokenisInvalid = await TokenBlackList.findOne({
        token: token,
      });

      if (tokenisInvalid) {
        return helper.response(res, 401, "Invalid token");
      }

      const decoded = jwt.verify(token, env.JWT_SECRET);

      let user = await User.findById(decoded.id).select("-password");

      req.user = user;

      next();
    } catch (err) {
      return helper.response(res, 401, "Unauthenticated");
    }
  } else {
    return helper.response(res, 401, "Unauthenticated");
  }
});

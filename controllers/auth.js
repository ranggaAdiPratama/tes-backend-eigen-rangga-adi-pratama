import RefreshToken from "../models/refreshToken.js";
import TokenBlackList from "../models/tokenBlackList.js";
import User from "../models/user.js";

import * as helper from "../helper.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    switch (true) {
      case !username:
        return helper.response(res, 400, "username is required");
      case !password:
        return helper.response(res, 400, "password is required");
      case password.length < 6:
        return helper.response(
          res,
          400,
          "password must be at least 6 characters long"
        );
    }

    let user = await User.findOne({ username });

    const match = await helper.comparePassword(password, user.password);

    if (!user) {
      return helper.response(res, 400, "User not found");
    }

    if (!match) {
      return helper.response(res, 400, "Incorrect password");
    }

    const token = helper.generateToken(user._id);

    const refreshToken = await helper.generateRefreshToken(user._id);

    const data = {
      user: {
        _id: user._id,
        name: user.name,
      },
      token,
      refreshToken,
    };

    helper.response(res, 200, "logged in successfully", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};

export const logout = async (req, res) => {
  try {
    const authorization = req.headers.authorization.split(" ")[1];

    await RefreshToken.updateMany(
      {
        user: req.user._id,
        $and: [{ revoked: "" }],
      },
      {
        $set: {
          revoked: new Date(Date.now()),
        },
      }
    );

    await new TokenBlackList({
      token: authorization,
    }).save();

    helper.response(res, 200, "logged out successfully");
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};

export const refresh = async (req, res) => {
  try {
    let { token } = req.body;

    let refreshToken = await RefreshToken.findOne({
      token,
      $and: [
        {
          revoked: "",
        },
      ],
    });

    if (!refreshToken) {
      return helper.response(res, 400, "Token tidak terdaftar", req.user._id);
    }

    await RefreshToken.updateMany(
      {
        user: refreshToken.user._id,
        $and: [{ revoked: "" }],
      },
      {
        $set: {
          revoked: new Date(Date.now()),
        },
      }
    );

    token = helper.generateToken(refreshToken.user);
    refreshToken = await helper.generateRefreshToken(refreshToken.user);

    const data = {
      token,
      refreshToken,
    };

    helper.response(res, 200, "Token berhasil direfresh", data);
  } catch (err) {
    return helper.response(res, 400, "Error : " + err.message, err);
  }
};

import mongoose from "mongoose";

const { Schema } = mongoose;

const tokenBlackListSchema = new Schema(
  {
    token: {
      type: {},
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("TokenBlackList", tokenBlackListSchema);

import mongoose from "mongoose";

const { Schema } = mongoose;

const { ObjectId } = mongoose.SchemaTypes;

const refreshTokenSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    revoked: {
      type: {},
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("RefreshToken", refreshTokenSchema);

import mongoose from "mongoose";

const { Schema } = mongoose;

const memberSchema = new Schema(
  {
    code: {
      type: String,
      index: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    borrowed: {
      type: Number,
      default: 0,
    },
    penalized: {
      type: Number,
      default: 0,
    },
    penalized_expires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Member", memberSchema);

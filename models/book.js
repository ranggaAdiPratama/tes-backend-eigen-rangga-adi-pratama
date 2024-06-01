import mongoose from "mongoose";

const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    code: {
      type: String,
      index: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Book", bookSchema);

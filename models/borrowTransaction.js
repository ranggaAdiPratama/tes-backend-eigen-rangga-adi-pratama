import mongoose from "mongoose";

const { Schema } = mongoose;

const { ObjectId } = mongoose.SchemaTypes;

const borrowTransactionSchema = new Schema(
  {
    member: {
      type: ObjectId,
      ref: "Member",
      required: true,
      index: true,
    },
    book: {
      type: ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("BorrowTransaction", borrowTransactionSchema);

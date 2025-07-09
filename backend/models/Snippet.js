import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "plaintext",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Snippet = mongoose.model("Snippet", snippetSchema);
export default Snippet;

// backend/models/Explanation.js

import mongoose from "mongoose";

const explanationSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: "plaintext",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // allow guest
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Explanation = mongoose.model("Explanation", explanationSchema);
export default Explanation;

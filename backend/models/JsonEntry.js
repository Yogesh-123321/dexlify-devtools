import mongoose from "mongoose";

const jsonEntrySchema = new mongoose.Schema(
  {
    user: {
      type: String, // ✅ changed from ObjectId
      required: true,
    },
    input: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["beautify", "minify"],
      required: true,
    },
  },
  { timestamps: true }
);

const JsonEntry = mongoose.model("JsonEntry", jsonEntrySchema);
export default JsonEntry;

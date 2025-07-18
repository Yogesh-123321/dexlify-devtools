import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true },
    language: { type: String, default: "plaintext" },

    // ✅ Either userId OR guestId will be set (not both)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    guestId: { type: String, required: false },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ✅ Custom validation: must have either userId or guestId
snippetSchema.pre("save", function (next) {
  if (!this.userId && !this.guestId) {
    return next(new Error("Snippet must belong to a user or guest."));
  }
  next();
});

const Snippet = mongoose.model("Snippet", snippetSchema);
export default Snippet;

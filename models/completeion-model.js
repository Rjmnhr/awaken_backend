const mongoose = require("mongoose");

const CompletionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    module: {
      type: String,
    },
    videoNo: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

// Add a compound index to enforce uniqueness for email, module, and videoNo
CompletionSchema.index({ email: 1, module: 1, videoNo: 1 }, { unique: true });

module.exports = mongoose.model("CompletionStatus", CompletionSchema);

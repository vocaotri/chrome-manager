const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChromeSchema = new Schema(
  {
    name: { type: String, default: null },
    proxy: { type: String, default: null },
    status: {
      type: String,
      enum: ["start", "stop"],
      default: "stop",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Chrome", ChromeSchema);
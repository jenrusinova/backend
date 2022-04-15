const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    fromuser: String,
    touser: { type: String, required: true, index: true },
    url: String,
    caption: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

module.exports = mongoose.model("Notification", notificationSchema);

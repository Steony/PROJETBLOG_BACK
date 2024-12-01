const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  usersname: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

module.exports = mongoose.model("posts", postSchema);

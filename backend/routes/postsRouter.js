const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authenticate } = require("../middleware/authMiddleware");

// Routes pour les posts
router.post("/newPost", authenticate, postController.createPost);
router.put("/modifyPost/:id", authenticate, postController.updatePost);
router.delete("/deletePost/:id", authenticate, postController.deletePost);
router.get("/displayAllPost", postController.getAllPosts);
router.post("/likePost/:id", authenticate, postController.likePost);

console.log(postController.createPost);

module.exports = router;

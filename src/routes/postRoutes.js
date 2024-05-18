//Load modules
const express = require("express");
const authorizeJWT = require("../middleware/authorizeJWT");
const postController = require("../controllers").posts;

// Assigning variable router to express.Router
const router = express.Router();

// Route to create a new post
router.post("/createPost", authorizeJWT, postController.createPost);

// Route to get a specific post
router.get("/getPost/:id", authorizeJWT, postController.getPost);

// Route to update a specific post
router.put("/editPost/:id", authorizeJWT, postController.editPost);

// Route to get posts
router.get("/getPosts", authorizeJWT, postController.getPosts);

module.exports = router;

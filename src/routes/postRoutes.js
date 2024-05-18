//Load modules
const express = require("express");
const authorizeJWT = require("../middleware/authorizeJWT");
const postController = require("../controllers").posts;

// Assigning variable router to express.Router
const router = express.Router();

// Endpoint to create a new post
router.post("/createPost", authorizeJWT, postController.createPost);

// Endpoint to get a specific post
router.get("/getPost/:id", authorizeJWT, postController.getPost);

// Endpoint to update a specific post
router.put("/editPost/:id", authorizeJWT, postController.editPost);

// Endpoint to get posts
router.get("/getPosts", authorizeJWT, postController.getPosts);

module.exports = router;

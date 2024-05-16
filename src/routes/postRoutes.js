//Load modules
const express = require("express");
const auth = require("../middleware/auth");
const { createPost } = require("../controllers/postController");

// Assigning variable router to express.Router
const router = express.Router();

router.post("/create", auth.authenticateToken, createPost);

module.exports = router;

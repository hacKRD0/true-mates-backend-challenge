//Load modules
const express = require("express");
const authorizeJWT = require("../middleware/authorizeJWT");
const { createPost } = require("../controllers/postController");

// Assigning variable router to express.Router
const router = express.Router();

router.post("/create", authorizeJWT, createPost);

module.exports = router;

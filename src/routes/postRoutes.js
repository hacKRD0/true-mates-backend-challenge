//Load modules
const express = require("express");
const authorizeJWT = require("../middleware/authorizeJWT");
const postController = require("../controllers").posts;

// Assigning variable router to express.Router
const router = express.Router();

router.post("/create", authorizeJWT, postController.createPost);

module.exports = router;

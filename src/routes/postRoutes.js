//Load modules
const express = require("express");
const authorizeJWT = require("../middleware/authorizeJWT");
const postController = require("../controllers").posts;

// Assigning variable router to express.Router
const router = express.Router();

router.post("/createPost", authorizeJWT, postController.createPost);

router.get("/getPost/:id", authorizeJWT, postController.getPost);

router.put("/editPost/:id", authorizeJWT, postController.editPost);

module.exports = router;

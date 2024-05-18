// Load modules
const express = require("express");
const authorizeJWT = require("../middleware/authorizeJWT");
const userController = require("../controllers").users;

const router = express.Router();

// Route to send a friend request
router.post("/addFriend", authorizeJWT, userController.addFriend);

// Route to accept or decline a friend request
router.post(
	"/acceptOrDeclineFriend",
	authorizeJWT,
	userController.acceptOrDeclineFriend
);

// Route to get a list of all friends with their details and the number of mutual friends
router.get("/getFriends", authorizeJWT, userController.getFriends);

module.exports = router;

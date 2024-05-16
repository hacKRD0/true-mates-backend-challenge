// Load modules
const posts = require("./postController");
const users = require("./userController");
const auth = require("./authController");

module.exports = { auth, posts, users };

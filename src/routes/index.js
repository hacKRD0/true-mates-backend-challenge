// Exports all routers as a part of a single object
const authRouter = require("./authRoutes");
const postRouter = require("./postRoutes");
const userRouter = require("./userRoutes");
module.exports = { authRouter, postRouter, userRouter };

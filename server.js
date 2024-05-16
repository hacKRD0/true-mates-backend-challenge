// Load required modules
const express = require("express");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRouter = require("./src/routes/authRoutes");
const postRouter = require("./src/routes/postRoutes");

// Assigning variable app to express
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes for user API
app.use("/api/users", authRouter);
app.use("/api/posts", postRouter);

app.get("/", (req, res) => {
	res.send("hello from express server");
});

// Setting up port and listening to server connection
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});

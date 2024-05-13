const express = require("express");
const authRouter = require("./routes/authRoutes");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());
app.use(authRouter);

app.get("/", (req, res) => {
	res.send("hello from express server");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});

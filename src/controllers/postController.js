// Load modules
const database = require("../models");
const { format } = require("util");
const { storage, bucket } = require("../config/gcpStorage");
const processFile = require("../middleware/upload");
const sequelize = require("../config/database");
const Post = database.Post;

const createPost = async (req, res) => {
	try {
		// Process the file using the upload middleware
		await processFile(req, res);
		const { description } = req.body;
		const { file } = req;
		const { user } = req;
		console.log(user);

		// Make sure the post contains an image
		if (!file) return res.status(400).send("No photo uploaded");

		// Create a new blob in the bucket and upload the file data
		const blob = bucket.file(req.file.originalname);
		const blobStream = blob.createWriteStream({ resumable: false });

		console.log("Starting blobstream");
		blobStream.on("error", (error) => {
			res.status(500).send({
				message: `File upload failed due to internal error!`,
				error: error.message,
			});
		});

		blobStream.on("finish", async (data) => {
			// Create a url for direct file access over http
			console.log("Starting blobstream finish");
			const publicUrl = format(
				`https://storage.googleapis.com/${bucket.name}/${blob.name}`
			);
			// console.log(publicUrl);
			// try {
			// 	// Make the file public
			// 	await bucket.file(req.file.originalname).makePublic();
			// } catch (error) {
			// 	return res.status(500).send({
			// 		message: `File upload successful: ${req.file.originalname}, but public access is denied!`,
			// 		url: publicUrl,
			// 		error: error.message,
			// 	});
			// }

			sequelize.sync().then(() => {
				// Add the new post with the public url to the database
				Post.create({
					description: description,
					photoUrl: publicUrl,
					userId: user.userId,
				})
					.then((post) => {
						return res.status(201).send({
							message: "Post creation successful!",
							post,
						});
					})
					.catch((error) => {
						return res.status(400).send({
							message: "Post creation failed!",
							error: error.message,
						});
					});
			});
		});

		blobStream.end(req.file.buffer);
	} catch (error) {
		res.status(500).send({
			message: `Post creation failed due to internal server error!`,
			error: error.message,
		});
	}
};

module.exports = { createPost };

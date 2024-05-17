// Load modules
const database = require("../models");
const { format } = require("util");
const { storage, bucket } = require("../config/gcpStorage");
const processFile = require("../middleware/upload");
const sequelize = require("../config/database");
const moment = require("moment");
const crypto = require("crypto");
const Post = database.Post;

const createPost = async (req, res) => {
	try {
		// Process the file using the upload middleware
		await processFile(req, res);
		const { description } = req.body;
		const { files } = req;
		const { user } = req;

		// Make sure the post contains an image
		if (!files || files.length === 0)
			return res.status(400).send("No photo uploaded");

		const photoUrls = await Promise.all(
			files.map((file) => {
				const hash = crypto
					.createHash("md5")
					.update(`${user.userId}-${file.originalname}-${Date.now()}`)
					.digest("hex");

				// Create a new blob in the bucket and upload the file data
				const hashedKey = "http://tinyurl/" + hash;
				const blob = bucket.file(hashedKey);
				const blobStream = blob.createWriteStream({ resumable: false });

				blobStream.on("error", (error) => {
					res.status(500).send({
						message: `File upload failed due to internal error!`,
						error: error.message,
					});
				});

				blobStream.on("finish", () => {
					// Construct the public URL
					const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
					resolve(publicUrl);
				});

				blobStream.end(file.buffer);
			})
		);

		sequelize.sync().then(() => {
			// Add the new post with the public url to the database
			Post.create({
				description: description,
				photoUrls: photoUrls,
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
	} catch (error) {
		console.log(error);
		res.status(500).send({
			message: `Post creation failed due to internal server error!`,
			error: error.message,
		});
	}
};

const getPost = async (req, res) => {
	const postId = req.params.id;
	// console.log(req);
	Post.findOne({ where: { id: postId } })
		.then((post) => {
			let timeAgo = moment(post.createdAt).fromNow();
			return res.status(200).send({ timeAgo: timeAgo });
		})
		.catch((error) => {
			return res
				.status(404)
				.send({ message: "Post not found!", error: error.message });
		});
};

const editPost = async (req, res) => {
	const postId = req.params.id;
	const userId = req.user.userId;
	const { description } = req.body;

	Post.update(
		{ description: description },
		{ where: { id: postId, userId: userId } }
	)
		.then((post) => {
			res.status(200).send({
				message: "Description updated successfully!",
				post,
			});
		})
		.catch((error) => {
			return res
				.status(404)
				.send({ message: "Post update failed!", error: error.message });
		});
};

module.exports = { createPost, getPost, editPost };

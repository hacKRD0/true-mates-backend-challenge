// Load modules
const database = require("../models");
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
		// Parsing the request
		const { description } = req.body;
		const { files } = req;
		const userId = req.user.userId;

		// Makes sure the post contains an image
		if (!files || files.length === 0)
			return res.status(400).send("No photo uploaded");

		// Creates the array of unique urls for the uploaded photos
		const photoUrls = await Promise.all(
			files.map((file) => {
				// Creates a hash using the current time, original filename and the userId as the secret key
				const hash = crypto
					.createHash("md5")
					.update(`${user.userId}-${file.originalname}-${Date.now()}`)
					.digest("hex");

				// Creates a new blob in the bucket and upload the file data
				const hashedKey = "http://tinyurl/" + hash;
				const blob = bucket.file(hashedKey);
				const blobStream = blob.createWriteStream({ resumable: false });

				// Uploads the file to GCS
				return new Promise((resolve, reject) => {
					// Returns the rejected promise with reason for failed upload of the file
					blobStream.on("error", (error) => reject(error));

					blobStream.on("finish", () => {
						// Returns the hashedKey to be stored in the photoUrls array
						resolve(hashedKey);
					});

					blobStream.end(file.buffer);
				});
			})
		);

		sequelize.sync().then(() => {
			// Add the new post with the photoUrls array to the database
			Post.create({
				description: description,
				photoUrls: photoUrls,
				userId: userId,
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
	// Parsing the request
	const postId = req.params.id;
	// Finds the post with the given postId
	Post.findOne({ where: { id: postId } })
		.then((post) => {
			// Calculates the time difference and returns it
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
	// Parsing the request
	const postId = req.params.id;
	const userId = req.user.userId;
	const { description } = req.body;

	// Updates the post description if the userId that sent the put request is the owner of the post
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

const getPosts = async (req, res) => {
	// Parsing the request
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 3;
	const offset = (page - 1) * limit;

	// Finds all posts ordered by 'createdAt' and returns upto limit number of posts from index offset of the result
	Post.findAndCountAll({
		limit: limit,
		offset: offset,
		order: [["createdAt", "DESC"]],
	})
		.then(async (result) => {
			return res.status(200).json({
				message: "Success!",
				data: result,
			});
		})
		.catch((error) => {
			res.status(400).send({
				message: "Failed",
				error: error.message,
			});
		});
};

module.exports = { createPost, getPost, editPost, getPosts };

// Load modules
const database = require("../models");
const User = database.User;
const UsersFriends = database.UsersFriends;
const FriendRequests = database.FriendRequests;

// Function sends a friend request
const addFriend = async (req, res) => {
	// Parsing the request
	const { friendId } = req.body;
	const userId = req.user.userId;

	// Doesn't allow a user to friend themself
	if (userId === friendId)
		return res.status(200).send({ message: "You can't friend yourself!" });

	// Checks if there is an existing request from the person user wants to send a friend request to.
	FriendRequests.findOne({
		where: {
			senderId: friendId,
			receiverId: userId,
		},
	})
		.then((friendRequest) => {
			if (friendRequest && friendRequest.status === "accepted") {
				// Sends this response if the user is already a friend
				return res.status(201).send({
					message: "User already a friend!",
				});
			} else if (friendRequest && friendRequest.status === "pending") {
				// Sends this response if user has an existing friend request sent from the person they are trying to send a friend request to
				return res.status(200).send({
					message: "The user has already sent you a friend request!",
				});
			}
		})
		.catch((error) => {
			pass;
		});

	// Creates the friend request if it doesn't already exist
	FriendRequests.findOrCreate({
		where: {
			senderId: userId,
			receiverId: friendId,
		},
	})
		.then((friendRequest) => {
			if (friendRequest[1]) {
				// Sends this response if the request has been created
				return res.status(201).send({
					message: "Friend request sent!",
				});
			} else {
				if (friendRequest[0].status === "accepted") {
					// Sends this response if the user is already a friend
					return res.status(201).send({
						message: "User already a friend!",
					});
				} else {
					// Sends this response if user has sent a friend request to this person before
					return res.status(200).send({
						message: "Friend request already sent!",
					});
				}
			}
		})
		.catch((error) => {
			return res.status(400).send({
				message: "Failed to send friend request!",
				error: error.message,
			});
		});
};

// Function accepts or declines a friend request
const acceptOrDeclineFriend = async (req, res) => {
	// Parsing the request
	const { friendId, decision } = req.body;
	const userId = req.user.userId;

	// Update the friendRequest status if it exists and the current status is pending
	FriendRequests.update(
		{ status: decision },
		{
			where: {
				senderId: friendId,
				receiverId: userId,
				status: "pending",
			},
		}
	)
		.then((friendrequest) => {
			if (decision === "accepted") {
				// Create two entries if friend request is accepted, one for each user
				UsersFriends.bulkCreate([
					{ friendId: friendId, userId: userId },
					{ friendId: userId, userId: friendId },
				])
					.then(() => {
						return res
							.status(201)
							.send({ message: "Hooray! You are friends now." });
					})
					.catch((error) => {
						return res.status(400).send({
							message: "Aww! You couldn't make a friend.",
							error: error.message,
						});
					});
			} else {
				// Return a message if the friend request is declined
				return res.status(200).send({
					message: "Friend request declined!",
				});
			}
		})
		.catch((error) => {
			return res.status(400).send({
				message: "Unfortunately, you couldn't become friends!",
				error: error.message,
			});
		});
};

// Function gets a list of all friends with their details and the number of mutual friends
const getFriends = async (req, res) => {
	// Parsing the request
	const userId = req.user.userId;
	// console.log(userId);

	try {
		// Finds all the friends of the current user
		const friends = await UsersFriends.findAll({
			where: {
				userId: userId,
			},
			attributes: ["friendId"],
		});

		// Extract a list of friendIds
		const friendIds = friends.map((friend) => friend.friendId);

		// Finds and returns the name and email of each friend in friendIds
		const friendDetails = await User.findAll({
			where: {
				id: friendIds,
			},
			attributes: ["id", "name", "email"],
		});

		// Creates a list with details of each friend along with the number mutual friends
		const getMutualFriendsCount = async (userId, friendId) => {
			// Query to get number of mutual friends from the UsersFriends table
			const mutualFriendsQuery = `
						SELECT COUNT(*) as mutualFriendCount
						FROM "UsersFriends" as uf1
						JOIN "UsersFriends" as uf2 ON uf1."friendId" = uf2."friendId"
						WHERE uf1."userId" = :userId AND uf2."userId" = :friendId
						`;

			// Executes the query using sequelize
			const result = await database.sequelize.query(mutualFriendsQuery, {
				replacements: {
					userId: userId,
					friendId: friendId,
				},
				type: database.Sequelize.QueryTypes.SELECT,
			});

			// Returns the number of mutual friends
			return result[0].mutualfriendcount;
		};

		// Updates the friendDetails list with the mutualFriendsCount for each friend
		for (let friend of friendDetails) {
			friend.dataValues.mutualFriendsCount = await getMutualFriendsCount(
				userId,
				friend.id
			);
		}

		// Returns a response with the friends list containing friend details and mutual friends
		return res.status(200).send({
			message: "Here are your friends!",
			friendDetails,
		});
	} catch (error) {
		return res.status(400).send({
			message: "Sorry! Couldn't retrieve friends' details.",
			error: error.message,
		});
	}
};

module.exports = { addFriend, acceptOrDeclineFriend, getFriends };

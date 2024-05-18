// Load modules
const { where } = require("sequelize");
const database = require("../models");
const User = database.User;
const UsersFriends = database.UsersFriends;
const FriendRequests = database.FriendRequests;

// Function sends a friend request
const addFriend = async (req, res) => {
	// Parsing the request
	const { friendId } = req.body;
	const userId = req.user.userId;

	FriendRequests.findOrCreate({
		where: {
			senderId: userId,
			receiverId: friendId,
		},
	})
		.then((friendrequest) => {
			if (friendrequest[1]) {
				// Sends this response if the request has been created
				return res.status(201).send({
					message: "Friend request sent!",
				});
			} else {
				if (friendrequest[0].status === "accepted") {
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

const getFriends = async (req, res) => {
	// Parsing the request
	const userId = req.user.userId;

	// Finds all the friends of the current user
	UsersFriends.findAll({
		where: {
			userId: { userId: userId },
			attributes: ["friendId"],
		},
	})
		.then((friends) => {
			// Extract a list of friendIds
			const friendIds = friends.map((friend) => friend.friendId);

			// Finds and returns the name and email of each friend in friendIds
			User.findAll({
				where: {
					id: friendIds,
				},
				attributes: ["id", "name", "email"],
			})
				.then((friendDetails) => {
					// Creates a list with details of each friend along with the number mutual friends
					const friendsList = friendDetails.map((friendDetail) => {
						const getMutualFriendsCount = async (
							userId,
							friendId
						) => {
							// Query to get number of mutual friends from the UserFriends table
							const mutualFriendsQuery = `
						SELECT COUNT(*) as mutualFriendCount
						FROM UserFriends as uf1
						JOIN UserFriends as uf2 ON uf1.friendId = uf2.friendId
						WHERE uf1.userId = :userId AND uf2.userId = :friendId;
						`;
							// Executes the query using sequelize
							const result = await sequelize.query(
								mutualFriendsQuery,
								{
									replacements: {
										userId: userId,
										friendId: friendId,
									},
									type: Sequelize.QueryTypes.SELECT,
								}
							);

							// Returns the number of mutual friends
							return result[0].mutualFriendCount;
						};

						// Returns an object with the friend's details and the number of mutual friends with the user
						return {
							friend: friendDetail,
							mutualFriends: getMutualFriendsCount(
								userId,
								friendDetail.id
							),
						};
					});

					// Returns a response with the friends list containing friend details and mutual friends
					return res.status(200).send({
						message: "Here are your friends!",
						friendsList,
					});
				})
				.catch((error) => {
					return res.status(400).send({
						message:
							"Sorry! We couldn't grab your friends' details.",
						error: error.message,
					});
				});
		})
		.catch((error) => {
			return res.status(400).send({
				message: "Sorry! We couldn't fetch your friends list.",
				error: error.message,
			});
		});
};

module.exports = { addFriend, acceptOrDeclineFriend, getFriends };

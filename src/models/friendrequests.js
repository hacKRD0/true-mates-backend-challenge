"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class FriendRequests extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			FriendRequests.belongsTo(models.User, {
				foreignKey: "senderId",
				onDelete: "CASCADE",
			});
		}
	}
	FriendRequests.init(
		{
			senderId: DataTypes.INTEGER,
			receiverId: DataTypes.INTEGER,
			status: {
				type: DataTypes.ENUM("pending", "accepted", "declined"),
				defaultValue: "pending",
			},
		},
		{
			sequelize,
			modelName: "FriendRequests",
		}
	);
	return FriendRequests;
};

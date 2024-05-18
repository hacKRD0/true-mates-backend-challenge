"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class UsersFriends extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			UsersFriends.belongsTo(models.User, {
				foreignKey: "userId",
				onDelete: "CASCADE",
			});
		}
	}
	UsersFriends.init(
		{
			friendId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "UsersFriends",
		}
	);
	return UsersFriends;
};

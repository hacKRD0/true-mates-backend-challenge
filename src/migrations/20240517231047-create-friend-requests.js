"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("FriendRequests", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			senderId: {
				type: Sequelize.INTEGER,
			},
			receiverId: {
				type: Sequelize.INTEGER,
			},
			status: {
				type: Sequelize.ENUM("pending", "accepted", "declined"),
				defaultValue: "pending",
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("FriendRequests");
	},
};

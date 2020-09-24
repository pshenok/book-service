/* eslint @typescript-eslint/explicit-function-return-type: 0 */
module.exports = {
	up: async (queryInterface, DataTypes) => {

		await queryInterface.createTable('authors', {
			id: {
				type:         DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey:   true,
			},
			name: {
				type:      DataTypes.STRING,
				allowNull: false,
			},
			createdAt: {
				type:         DataTypes.DATE,
				defaultValue: DataTypes.fn('NOW'),
				allowNull:    false,
			},
			updatedAt: {
				type:         DataTypes.DATE,
				defaultValue: DataTypes.fn('NOW'),
				allowNull:    false,
			},
		});

		await queryInterface.addIndex('authors', { fields: ['name'] });
		await queryInterface.addIndex('authors', { fields: ['createdAt'] });

		await queryInterface.createTable('books', {
			id: {
				type:         DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey:   true,
			},
			authorId: {
				type:      DataTypes.UUID,
				allowNull: true,
				reference: {
					model: {
						tableName: 'authors',
						schema:    'public',
					},
					key: 'id',
				}
			},
			name: {
				type:      DataTypes.STRING,
				allowNull: false,
			},
			releaseDate: {
				type:      DataTypes.DATE,
				allowNull: true,
			},
			fileUrl: {
				type:      DataTypes.STRING,
				allowNull: false,
			},
			createdAt: {
				type:         DataTypes.DATE,
				defaultValue: DataTypes.fn('NOW'),
				allowNull:    false,
			},
			updatedAt: {
				type:         DataTypes.DATE,
				defaultValue: DataTypes.fn('NOW'),
				allowNull:    false,
			},
		});


		await queryInterface.addIndex('books', { fields: ['authorId'] });
		await queryInterface.addIndex('books', { fields: ['name'] });
		await queryInterface.addIndex('books', { fields: ['createdAt'] });
	},

	down: async (queryInterface) => {
		await queryInterface.dropTable('books');
		await queryInterface.dropTable('authors');
	},
};

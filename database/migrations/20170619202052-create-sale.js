module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Sales', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      UserId: {
        type: Sequelize.INTEGER.UNSIGNED,
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      total: {
        type: Sequelize.FLOAT.UNSIGNED,
      },
      folio: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Sales')
  },
}

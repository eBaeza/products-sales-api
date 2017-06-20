module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('SaleProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      SaleId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: { model: 'Sales', key: 'id' },
      },
      ProductId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: { model: 'Products', key: 'id' },
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
    return queryInterface.dropTable('SaleProducts')
  },
}

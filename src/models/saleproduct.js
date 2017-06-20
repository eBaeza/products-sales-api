export default (sequelize, DataTypes) => {
  const SaleProduct = sequelize.define('SaleProduct', {
    SaleId: {
      type: DataTypes.INTEGER,
      references: { model: 'Sales', key: 'id' },
    },
    ProductId: {
      type: DataTypes.INTEGER,
      references: { model: 'Products', key: 'id' },
    },
  })

  SaleProduct.associate = (models) => {
    // associations can be defined here
    SaleProduct.belongsTo(models.Sale)
    SaleProduct.belongsTo(models.Product)
  }

  return SaleProduct
}

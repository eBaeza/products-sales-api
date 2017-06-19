module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT,
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      },
    },
  })
  return Product
}

export default (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'The title of product is required.' } },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: { msg: 'The price must be numeric.' },
        min: { args: 1, msg: 'The price should not be less than 1.' },
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: 'The image is not a valid url.' },
      },
    },
  })

  Product.associate = (models) => {
    Product.hasMany(models.SaleProduct)
  }

  return Product
}

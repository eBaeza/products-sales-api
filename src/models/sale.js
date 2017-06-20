export default (sequelize, DataTypes) => {
  const Sale = sequelize.define('Sale', {
    UserId: DataTypes.INTEGER,
    folio: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'The title of the sale is required.' } },
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: 'Add the description or comments of the sale',
    },
    total: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  })

  Sale.associate = (models) => {
    // associations can be defined here
    Sale.belongsTo(models.User)
    Sale.hasMany(models.SaleProduct)
  }

  return Sale
}

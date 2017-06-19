module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define('Sale', {
    UserId: DataTypes.INTEGER.UNSIGNED,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    total: DataTypes.INTEGER,
  })

  Sale.associate = (models) => {
    // associations can be defined here
    Sale.belongsTo(models.User)
  }

  return Sale
}

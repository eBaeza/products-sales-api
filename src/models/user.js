const { hashSync } = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Your first name is required.' } },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Your last name is required.' } },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Your email is required.' },
        isEmail: { msg: 'Your email has an invalid format.' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        const hash = hashSync(val, 5)
        this.setDataValue('password', hash)
      },
    },
  })

  User.associate = (models) => {
    // associations can be defined here
    User.hasMany(models.Sale)
  }

  return User
}

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
      validate: {
        notEmpty: { msg: 'Your email is required.' },
        isEmail: { msg: 'Your email has an invalid format.' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Your password is required.' },
        isAlphanumeric: { msg: 'The password only accepts alphanumeric characters.' },
        len: { args: [6, 8], msg: 'The password must be between 6 and 8 characters.' },
      },
    },
  })

  User.associate = (models) => {
    // associations can be defined here
    User.hasMany(models.Sale)
  }

  return User
}

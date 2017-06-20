const { hashSync } = require('bcrypt')

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'Edgar',
      lastName: 'Baeza',
      email: 'edgar@mail.com',
      password: hashSync('trololo', 5),
      createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
      updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
    }], {})
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {})
  },
}

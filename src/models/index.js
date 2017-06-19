const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const configs = require('../../config/database.json')

const basename = path.basename(module.filename)
const modelFiles = []

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach((file) => {
    modelFiles.push(path.join(__dirname, file))
  })

// Set database to use
const setConfigDB = (version) => {
  let _v

  switch (version) {
    case 'v1': {
      _v = 'development'
      break
    }

    case 'v2': {
      _v = 'development_2'
      break
    }

    default: {
      _v = 'development'
      break
    }
  }

  const config = configs[_v]

  return new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  )
}

// initialize DB
const initDB = (version) => {
  const sequelize = setConfigDB(version)
  const db = {}

  modelFiles.forEach((file) => {
    const model = sequelize.import(file)
    db[model.name] = model
  })

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })

  db.sequelize = sequelize

  return db
}

module.exports = initDB

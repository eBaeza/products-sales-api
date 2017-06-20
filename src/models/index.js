import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import configs from '../../config/database.json'

const env = process.env.NODE_ENV || 'development'
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
      _v = env
      break
    }

    case 'v2': {
      _v = `${env}_2`
      break
    }

    default: {
      _v = env
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
    db[model.name] = sequelize.import(file)
  })

  Object.keys(db).forEach((modelName) => {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db)
    }
  })

  db.sequelize = sequelize
  db.Sequelize = Sequelize

  return db
}

export default initDB

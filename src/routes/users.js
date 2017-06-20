import { Router } from 'express'
import validationErrorsMap from '../utils/validationErrorsMap'

// Models
import initDB from '../models'

const router = Router()

/* List of users */
router.get('/', async (req, res) => {
  const version = req.db
  const DB = initDB(version)
  const { User } = DB

  const page = Number(req.query.page || 1)
  const limit = 100
  const offset = (page - 1) * limit

  try {
    const users = await User.findAndCountAll({
      offset,
      limit,
      order: [['firstName', 'ASC'], ['lastName', 'ASC']],
    })

    res.status(200).json({
      page,
      total: users.count,
      data: users.rows,
    })
  } catch (error) {
    console.log(error)
    // oops! something went wrong
    res.status(500).json({ error: 'Oops! something went wrong' })
  }
})

/* Create a user */
router.post('/', async (req, res) => {
  const version = req.db
  const DB = initDB(version)
  const { User } = DB

  const userData = req.body
  const newUser = User.build(userData)

  try {
    await newUser.validate()
  } catch (errors) {
    res.status(400).json(validationErrorsMap(errors))
    return
  }

  try {
    await newUser.save()
    res.status(201).json(newUser)
  } catch (error) {
    if (error.name && error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json(validationErrorsMap(error))
    } else {
      console.log(error)
      // oops! something went wrong
      res.status(500).json({ error: 'Oops! something went wrong' })
    }
  }
})

/* Get a single user */
router.get('/:id', async (req, res) => {
  const version = req.db
  const DB = initDB(version)
  const { User } = DB
  const id = Number.isInteger(parseInt(req.params.id, 10)) ? req.params.id : null

  try {
    const user = await User.findById(id)

    if (user === null) {
      res.status(404).json({ error: 'User doesn\'t exist' })
      return
    }

    res.status(200).json(user)
  } catch (error) {
    console.log(error)
    // oops! something went wrong
    res.status(500).json({ error: 'Oops! something went wrong' })
  }
})

/* Update a user */
router.put('/:id', async (req, res) => {
  const version = req.db
  const DB = initDB(version)
  const { User } = DB
  const id = Number.isInteger(parseInt(req.params.id, 10)) ? req.params.id : null

  const user = await User.findById(id)

  if (user === null) {
    res.status(404).json({ error: 'User doesn\'t exist' })
    return
  }

  try {
    await user.update(req.body)
    res.status(200).json(user)
  } catch (errors) {
    res.status(400).json(validationErrorsMap(errors))
  }
})

/* Delete a user */
router.delete('/:id', async (req, res) => {
  const version = req.db
  const DB = initDB(version)
  const { User } = DB
  const id = Number.isInteger(parseInt(req.params.id, 10)) ? req.params.id : null

  const user = await User.findById(id)

  if (user === null) {
    res.status(404).json({ error: 'User doesn\'t exist' })
    return
  }

  try {
    await user.destroy()
    res.status(204).end()
  } catch (error) {
    console.log(error)
    // oops! something went wrong
    res.status(500).json({ error: 'Oops! something went wrong' })
  }
})

export default router

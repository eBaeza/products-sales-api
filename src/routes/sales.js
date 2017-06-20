import { Router } from 'express'
import validationErrorsMap from '../utils/validationErrorsMap'

// Models
import initDB from '../models'

const router = Router()

/* List of sales */
router.get('/', async (req, res) => {
  const version = req.db
  const DB = initDB(version)
  const { Sale } = DB

  const page = Number(req.query.page || 1)
  const limit = 100
  const offset = (page - 1) * limit

  try {
    const sales = await Sale.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'ASC']],
    })

    res.status(200).json({
      page,
      total: sales.count,
      data: sales.rows,
    })
  } catch (error) {
    console.log(error)
    // oops! something went wrong
    res.status(500).json({ error: 'Oops! something went wrong' })
  }
})

/* Create a sale */
router.post('/', async (req, res) => {
  const version = req.db
  const DB = initDB(version)
  const { Sale } = DB

  const saleData = {
    UserId: req.user.id,
    title: req.body.title,
    description: req.body.description,
  }

  const newSale = Sale.build(saleData)

  try {
    await newSale.validate()
  } catch (errors) {
    res.status(400).json(validationErrorsMap(errors))
    return
  }

  try {
    await newSale.save()
    res.status(201).json(newSale)
  } catch (error) {
    console.log(error)
    // oops! something went wrong
    res.status(500).json({ error: 'Oops! something went wrong' })
  }
})

/* Get a single sale */
router.get('/:id', async (req, res) => {
  const version = req.db
  const DB = initDB(version)
  const { Sale } = DB
  const id = Number.isInteger(parseInt(req.params.id, 10)) ? req.params.id : null

  try {
    const sale = await Sale.findById(id)

    if (sale === null) {
      res.status(404).json({ error: 'The sale doesn\'t exist' })
      return
    }

    res.status(200).json(sale)
  } catch (error) {
    console.log(error)
    // oops! something went wrong
    res.status(500).json({ error: 'Oops! something went wrong' })
  }
})

/* Update a sale */
router.put('/:id', async (req, res) => {
  const version = req.db
  const DB = initDB(version)
  const { Sale } = DB
  const id = Number.isInteger(parseInt(req.params.id, 10)) ? req.params.id : null

  const sale = await Sale.findById(id)

  if (sale === null) {
    res.status(404).json({ error: 'The sale doesn\'t exist' })
    return
  }

  const updateDate = {
    title: req.body.title,
    description: req.body.description,
  }

  try {
    await sale.update(updateDate)
    res.status(200).json(sale)
  } catch (errors) {
    res.status(400).json(validationErrorsMap(errors))
  }
})

/* delete a sale */
router.delete('/:id', async (req, res) => {
  const version = req.db
  const DB = initDB(version)
  const { Sale } = DB
  const id = Number.isInteger(parseInt(req.params.id, 10)) ? req.params.id : null

  const sale = await Sale.findById(id)

  if (sale === null) {
    res.status(404).json({ error: 'The sale doesn\'t exist' })
    return
  }

  try {
    await sale.destroy()
    res.status(204).end()
  } catch (error) {
    console.log(error)
    // oops! something went wrong
    res.status(500).json({ error: 'Oops! something went wrong' })
  }
})

export default router

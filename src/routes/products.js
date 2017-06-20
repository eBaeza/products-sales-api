import { Router } from 'express'
import validationErrorsMap from '../utils/validationErrorsMap'

// Models
import initDB from '../models'

const router = Router()

/* List of products */
router.get('/', async (req, res) => {
  const version = req.db
  const DB = initDB(version)
  const { Product } = DB

  const page = Number(req.query.page || 1)
  const limit = 100
  const offset = (page - 1) * limit

  try {
    const products = await Product.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'ASC']],
    })

    res.status(200).json({
      page,
      total: products.count,
      data: products.rows,
    })
  } catch (error) {
    console.log(error)
    // oops! something went wrong
    res.status(500).json({ error: 'Oops! something went wrong' })
  }
})

/* Create a product */
router.post('/', async (req, res) => {
  const version = req.db
  const DB = initDB(version)
  const { Product } = DB

  const productData = req.body
  const newProduct = Product.build(productData)

  try {
    await newProduct.validate()
  } catch (errors) {
    res.status(400).json(validationErrorsMap(errors))
    return
  }

  try {
    await newProduct.save()
    res.status(201).json(newProduct)
  } catch (error) {
    console.log(error)
    // oops! something went wrong
    res.status(500).json({ error: 'Oops! something went wrong' })
  }
})

/* Get a single product */
router.get('/:id', async (req, res) => {
  const version = req.db
  const DB = initDB(version)
  const { Product } = DB
  const id = Number.isInteger(parseInt(req.params.id, 10)) ? req.params.id : null

  try {
    const product = await Product.findById(id)

    if (product === null) {
      res.status(404).json({ error: 'The product doesn\'t exist' })
      return
    }

    res.status(200).json(product)
  } catch (error) {
    console.log(error)
    // oops! something went wrong
    res.status(500).json({ error: 'Oops! something went wrong' })
  }
})

/* Update a product */
router.put('/:id', async (req, res) => {
  const version = req.db
  const DB = initDB(version)
  const { Product } = DB
  const id = Number.isInteger(parseInt(req.params.id, 10)) ? req.params.id : null

  const product = await Product.findById(id)

  if (product === null) {
    res.status(404).json({ error: 'The product doesn\'t exist' })
    return
  }

  try {
    await product.update(req.body)
    res.status(200).json(product)
  } catch (errors) {
    res.status(400).json(validationErrorsMap(errors))
  }
})

/* delete a product */
router.delete('/:id', async (req, res) => {
  const version = req.db
  const DB = initDB(version)
  const { Product } = DB
  const id = Number.isInteger(parseInt(req.params.id, 10)) ? req.params.id : null

  const product = await Product.findById(id)

  if (product === null) {
    res.status(404).json({ error: 'The product doesn\'t exist' })
    return
  }

  try {
    await product.destroy()
    res.status(204).end()
  } catch (error) {
    console.log(error)
    // oops! something went wrong
    res.status(500).json({ error: 'Oops! something went wrong' })
  }
})

export default router

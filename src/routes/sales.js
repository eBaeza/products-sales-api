import { Router } from 'express'
import validationErrorsMap from '../utils/validationErrorsMap'
import { normalizeIdParam } from '../utils'

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
  const { Sale, SaleProduct, Product } = DB
  const id = normalizeIdParam(req.params.id)

  try {
    const sale = await Sale.findById(id, {
      include: [{
        model: SaleProduct,
        include: Product,
      }],
    })

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
  const id = normalizeIdParam(req.params.id)

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
  const id = normalizeIdParam(req.params.id)

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

/* Add products to sale */
router.post('/:id/products', async (req, res) => {
  let productIds = Array.isArray(req.body.products) ? req.body.products : []
  const version = req.db
  const DB = initDB(version)
  const { Sale, SaleProduct, Product } = DB

  const sale = await Sale.findById(req.params.id)

  if (sale === null) {
    res.status(404).json({ error: 'The sale doesn\'t exist' })
    return
  }

  // Normalize ids
  productIds = productIds.map(pI => ({
    id: normalizeIdParam(pI),
    param: pI,
  }))

  const invalidIds = productIds.filter(pI => pI.id === null).map(pI => pI.param)

  if (invalidIds.length > 0) {
    res.status(400).json({
      error: `The following are not valid ids for a Product: "${invalidIds.join(', ')}"`,
    })
    return
  }

  // Find products
  const products = await Promise.all(
    productIds.map(pI => Product.findById(pI.id)),
  )

  const notFound = products.reduce((nF, p, idx) => {
    if (p === null) nF.push(productIds[idx].param)
    return nF
  }, [])

  if (notFound.length > 0) {
    res.status(400).json({
      error: `The following products do not exist: "${notFound.join(', ')}"`,
    })
    return
  }

  // Create news relation
  const newAssoc = await Promise.all(products.map(p => SaleProduct.create({
    SaleId: sale.id,
    ProductId: p.id,
  })))
  // Get info of added products
  const addedProducts = await Promise.all(newAssoc.map(nA => nA.getProduct()))
  // Get total
  const total = addedProducts.reduce(
    (t, p) => t + p.price,
    sale.total,
  )

  await sale.update({ total })
  await sale.reload({
    include: [{
      model: SaleProduct,
      include: Product,
    }],
  })

  res.status(200).json(sale)
})

/* Add products to sale */
router.delete('/:id/products', async (req, res) => {
  let productIds = Array.isArray(req.body.products) ? req.body.products : []
  const version = req.db
  const DB = initDB(version)
  const { Sale, SaleProduct, Product } = DB

  const sale = await Sale.findById(req.params.id)

  if (sale === null) {
    res.status(404).json({ error: 'The sale doesn\'t exist' })
    return
  }

  // Normalize ids
  productIds = productIds.map(pI => ({
    id: normalizeIdParam(pI),
    param: pI,
  }))

  const invalidIds = productIds.filter(pI => pI.id === null).map(pI => pI.param)

  if (invalidIds.length > 0) {
    res.status(400).json({
      error: `The following are not valid ids for a Product: "${invalidIds.join(', ')}"`,
    })
    return
  }

  // Find products
  const products = await Promise.all(
    productIds.map(pI => Product.findById(pI.id)),
  )

  const notFound = products.reduce((nF, p, idx) => {
    if (p === null) nF.push(productIds[idx].param)
    return nF
  }, [])

  if (notFound.length > 0) {
    res.status(400).json({
      error: `The following products do not exist: "${notFound.join(', ')}"`,
    })
    return
  }

  const toRemove = await Promise.all(productIds.map((p, idx) => (
    SaleProduct.findOne({
      where: {
        SaleId: sale.id,
        ProductId: p.id,
      },
      offset: idx,
      order: [['createdAt', 'DESC']],
    })
  )))

  // Remove products
  await Promise.all(toRemove.filter(p => p !== null).map(p => p.destroy()))

  // await sale.update({ total: sale.total + sum })
  await sale.reload({
    include: [{
      model: SaleProduct,
      include: Product,
    }],
  })

  res.status(200).json(sale)
})

export default router

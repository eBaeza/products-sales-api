const { Router } = require('express')

const router = Router()

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Product sales API REST' })
})

module.exports = router

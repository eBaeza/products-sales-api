import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
// config
import config from '../../config/app.json'
// Models
import initDB from '../models'

const router = Router()

/* GET home page. */
router.post('/', async (req, res) => {
  const version = req.db
  const DB = initDB(version)
  const { User } = DB

  // find the user
  const user = await User.findOne({ where: { email: req.body.email } })

  if (user === null) res.status(404).json({ error: 'Authentication failed. User not found.' })

  try {
    await bcrypt.compare(req.body.password, user.password)
    // create a token
    const token = jwt.sign(user.get({ plain: true }), config.secret, {
      expiresIn: '1 days',
    })

    // return the information including token as JSON
    res.status(200).json({
      success: true,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(403).json({ error: 'Authentication failed. Wrong password.' })
  }
})

export default router

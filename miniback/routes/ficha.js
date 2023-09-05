const express = require('express')
const {
  getFichas, 
  getFicha, 
  createFicha, 
  deleteFicha, 
  updateFicha
} = require('../controllers/fichaController')

const router = express.Router()

// GET all fichas
router.get('/', getFichas)

// GET a single ficha
router.get('/:id', getFicha)

// POST a new ficha
router.post('/', createFicha)

// DELETE a ficha
router.delete('/:id', deleteFicha)

// UPDATE a ficha
router.patch('/:id', updateFicha)

module.exports = router
const express = require('express')
const {
  getCategorias, 
  getCategoria, 
  createCategoria, 
  deleteCategoria, 
  updateCategoria
} = require('../controllers/categoriaController')

const router = express.Router()

// GET all categorias
router.get('/', getCategorias)

// GET a single categoria
router.get('/:id', getCategoria)

// POST a new categoria
router.post('/', createCategoria)

// DELETE a categoria
router.delete('/:id', deleteCategoria)

// UPDATE a categoria
router.patch('/', updateCategoria)

module.exports = router
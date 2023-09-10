const Categoria = require('../models/categoriaModel')
const mongoose = require('mongoose')

// get all categorias
const getCategorias = async (req, res) => {
  const categorias = await Categoria.find({}).sort({createdAt: -1})
  const totalDatos = categorias.length;

  res.status(200).json({lista: categorias, totalDatos})
}

// get a single categoria
const getCategoria = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such categoria'})
  }

  const categoria = await Categoria.findById(id)

  if (!categoria) {
    return res.status(404).json({error: 'No such categoria'})
  }

  res.status(200).json(categoria)
}

// create a new categoria
const createCategoria = async (req, res) => {
  const {descripcion} = req.body

  // add to the database
  try {
    const categoria = await Categoria.create({ descripcion })
    res.status(200).json(categoria)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete a categoria
const deleteCategoria = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such categoria'})
  }

  const categoria = await Categoria.findOneAndDelete({_id: id})

  if(!categoria) {
    return res.status(400).json({error: 'No such categoria'})
  }

  res.status(200).json(categoria)
}

// update a categoria
const updateCategoria = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body._id)) {
    return res.status(400).json({error: 'No such categoria'})
  }
  

  const categoria = await Categoria.findOneAndUpdate({_id: req.body._id}, {
    ...req.body
  })

  if (!categoria) {
    return res.status(400).json({error: 'No such categoria'})
  }

  res.status(200).json(categoria)
}

module.exports = {
  getCategorias,
  getCategoria,
  createCategoria,
  deleteCategoria,
  updateCategoria
}
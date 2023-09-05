
const Ficha = require('../models/fichaModel')
const Persona = require('../models/personaModel')
const Categoria = require('../models/categoriaModel')
const mongoose = require('mongoose')

// get all fichas
const getFichas = async (req, res) => {
  const fichas = await Ficha.find({}).sort({createdAt: -1})

  res.status(200).json(fichas)
}

// get a single ficha
const getFicha = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such ficha'})
  }

  const ficha = await Ficha.findById(id)

  if (!ficha) {
    return res.status(404).json({error: 'No such ficha'})
  }

  res.status(200).json(ficha)
}

// create a new ficha
const createFicha = async (req, res) => {
  const {fecha, motivoConsulta, diagnostico, descripcionCategoria, cedulaDoctor, cedulaPaciente} = req.body

  // add to the database
  try {
    const idDoctor = await Persona.findOne({cedula: cedulaDoctor})
    const idPaciente = await Persona.findOne({cedula: cedulaPaciente})
    const idCategoria = await Categoria.findOne({descripcion: descripcionCategoria})
    const ficha = await Ficha.create({fecha, motivoConsulta, diagnostico, descripcionCategoria, cedulaDoctor, cedulaPaciente})
    res.status(200).json(ficha)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete a ficha
const deleteFicha = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such ficha'})
  }

  const ficha = await Ficha.findOneAndDelete({_id: id})

  if(!ficha) {
    return res.status(400).json({error: 'No such ficha'})
  }

  res.status(200).json(ficha)
}

// update a ficha
const updateFicha = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such ficha'})
  }

  const ficha = await Ficha.findOneAndUpdate({_id: id}, {
    ...req.body
  })

  if (!ficha) {
    return res.status(400).json({error: 'No such ficha'})
  }

  res.status(200).json(ficha)
}

module.exports = {
  getFichas,
  getFicha,
  createFicha,
  deleteFicha,
  updateFicha
}
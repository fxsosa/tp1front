
const Ficha = require('../models/fichaModel')
const Persona = require('../models/personaModel')
const Categoria = require('../models/categoriaModel')
const Reserva = require('../models/reservaModel')
const mongoose = require('mongoose')

// get all fichas
const getFichas = async (req, res) => {
  const fichas = await Ficha.find({}).sort({createdAt: -1})
  const totalDatos = fichas.length;

  res.status(200).json({lista: fichas, totalDatos})
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
  const {fecha, motivoConsulta, diagnostico, idCategoria, idDoctor, idPaciente, idReserva} = req.body

  // add to the database
  try {
    if (!mongoose.Types.ObjectId.isValid(idDoctor)) {
      return res.status(404).json({error: 'No such Doctor'})
    }
    if (!mongoose.Types.ObjectId.isValid(idPaciente)) {
      return res.status(404).json({error: 'No such Paciente'})
    }
   /*  if (!mongoose.Types.ObjectId.isValid(idReserva)) {
      return res.status(404).json({error: 'No such Reserva'})
    } */
    if (!mongoose.Types.ObjectId.isValid(idCategoria)) {
      return res.status(404).json({error: 'No such Categoria'})
    }
    const ficha = await Ficha.create({fecha, motivoConsulta, diagnostico, idCategoria, idDoctor, idPaciente, idReserva})
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
  if (!mongoose.Types.ObjectId.isValid(req.body._id)) {
    return res.status(400).json({error: 'No such ficha'})
  }

  const ficha = await Ficha.findOneAndUpdate({_id: req.body._id}, {
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

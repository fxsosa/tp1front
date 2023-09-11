
const Reserva = require('../models/reservaModel')
const Persona = require('../models/personaModel')
const mongoose = require('mongoose')

// get all reservas
const getReservas = async (req, res) => {
  const reservas = await Reserva.find({}).sort({createdAt: -1})

  const totalDatos = reservas.length;

  res.status(200).json({lista: reservas, totalDatos})
}

// get a single reserva
const getReserva = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such reserva'})
  }

  const reserva = await Reserva.findById(id)

  if (!reserva) {
    return res.status(404).json({error: 'No such reserva'})
  }

  res.status(200).json(reserva)
}

// create a new reserva
const createReserva = async (req, res) => {
  const {fechaInicioReserva, fechaFinReserva, idPaciente, idDoctor} = req.body

  // add to the database
  try {
    const doctor = await Persona.findById(idDoctor)._id
    const paciente = await Persona.findById(idPaciente)._id
    const reserva = await Reserva.create({fechaInicioReserva, fechaFinReserva, idDoctor, idPaciente})
    res.status(200).json(reserva)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete a reserva
const deleteReserva = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such reserva'})
  }

  const reserva = await Reserva.findOneAndDelete({_id: id})

  if(!reserva) {
    return res.status(400).json({error: 'No such reserva'})
  }

  res.status(200).json(reserva)
}

// update a reserva
const updateReserva = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body._id)) {
    return res.status(400).json({error: 'No such reserva'})
  }

  const reserva = await Reserva.findOneAndUpdate({_id: req.body._id}, {
    ...req.body
  })

  if (!reserva) {
    return res.status(400).json({error: 'No such reserva'})
  }

  res.status(200).json(reserva)
}

module.exports = {
  getReservas,
  getReserva,
  createReserva,
  deleteReserva,
  updateReserva
}
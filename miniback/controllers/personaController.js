const Persona = require('../models/personaModel')
const mongoose = require('mongoose')

// get all personas
const getPersonas = async (req, res) => {
  const personas = await Persona.find({}).sort({createdAt: -1})
  const totalDatos = personas.length;

  res.status(200).json({lista: personas, totalDatos})
}

// get by es doctor
const getByEsDoctor = async (req, res) => {
  const { esDoctor } = req.params

  if (esDoctor !== undefined && (esDoctor === 'true' || esDoctor === 'false')) {
    const personas = await Persona.find({ esDoctor: esDoctor === 'true' });
    res.status(200).json(personas)

  }
  else{
    return res.status(404).json({error: 'No such persona'})
  }

}
// get a single persona
const getPersona = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such persona'})
  }

  const persona = await Persona.findById(id)

  if (!persona) {
    return res.status(404).json({error: 'No such persona'})
  }

  res.status(200).json(persona)
}

// create a new persona
const createPersona = async (req, res) => {
  const { nombre, apellido, telefono, email, cedula, esDoctor } = req.body

  // add to the database
  try {
    const persona = await Persona.create({ nombre, apellido, telefono, email, cedula, esDoctor })
    res.status(200).json(persona)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete a persona
const deletePersona = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such persona'})
  }

  const persona = await Persona.findOneAndDelete({_id: id})

  if(!persona) {
    return res.status(400).json({error: 'No such persona'})
  }

  res.status(200).json(persona)
}

// update a persona
const updatePersona = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body._id)) {
    return res.status(400).json({error: 'No such persona'})
  }

  const persona = await Persona.findOneAndUpdate({_id: req.body._id}, {
    ...req.body
  })

  if (!persona) {
    return res.status(400).json({error: 'No such persona'})
  }

  res.status(200).json(persona)
}

module.exports = {
  getPersonas,
  getByEsDoctor,
  getPersona,
  createPersona,
  deletePersona,
  updatePersona
}
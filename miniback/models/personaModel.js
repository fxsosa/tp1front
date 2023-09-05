const mongoose = require('mongoose')

const Schema = mongoose.Schema

const personaSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cedula: {
    type: String,
    required: true
  },
  esDoctor: {
    type: Boolean,
    required: true
  }

  
}, { timestamps: true })

module.exports = mongoose.model('Persona', personaSchema)
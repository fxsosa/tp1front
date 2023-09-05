const mongoose = require('mongoose')

const Schema = mongoose.Schema

const fichaSchema = new Schema({
  fecha: {
    type: Date,
    required: true
  },
  motivoConsulta: {
    type: String,
    required: true
  },
  diagnostico: {
    type: String,
    default: false
  },
  idDoctor: {
    type: Schema.Types.ObjectId,
    ref: 'persona',
    required: true
  },
  idPaciente: {
    type: Schema.Types.ObjectId,
    ref: 'persona',
    required: true
  },
  idCategoria: {
    type: Schema.Types.ObjectId,
    ref: 'categoria',
    required: true
  }
  
}, { timestamps: true })

module.exports = mongoose.model('Ficha', fichaSchema)
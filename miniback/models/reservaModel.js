const mongoose = require('mongoose')

const Schema = mongoose.Schema

const reservaSchema = new Schema({
  fechaInicioReserva: {
    type: Date,
    required: true
  },
  fechaFinReserva: {
    type: Date,
    required: true
  },
  cancelada: {
    type: Boolean,
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
  }
  
}, { timestamps: true })

module.exports = mongoose.model('Reserva', reservaSchema)
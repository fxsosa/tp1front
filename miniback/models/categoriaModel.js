const mongoose = require('mongoose')

const Schema = mongoose.Schema

const categoriaSchema = new Schema({
  descripcion: {
    type: String,
    required: true
  }
  
}, { timestamps: true })

module.exports = mongoose.model('Categoria', categoriaSchema)
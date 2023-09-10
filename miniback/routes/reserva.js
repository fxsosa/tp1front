const express = require('express')
const {
  getReservas, 
  getReserva, 
  createReserva, 
  deleteReserva, 
  updateReserva
} = require('../controllers/reservaController')

const router = express.Router()

// GET all reservas
router.get('/', getReservas)

// GET a single reserva
router.get('/:id', getReserva)

// POST a new reserva
router.post('/', createReserva)

// DELETE a reserva
router.delete('/:id', deleteReserva)

// UPDATE a reserva
router.patch('/', updateReserva)

module.exports = router
const express = require('express')
const {
  getPersonas, 
  getByEsDoctor, 
  getPersona, 
  createPersona, 
  deletePersona, 
  updatePersona
} = require('../controllers/personaController')

const router = express.Router()

// GET all personas
router.get('/', getPersonas)

// GET by esDoctor(boolean)
router.get('/getByesDoctor/:esDoctor', getByEsDoctor)

// GET a single persona
router.get('/:id', getPersona)

// POST a new persona
router.post('/', createPersona)

// DELETE a persona
router.delete('/:id', deletePersona)

// UPDATE a persona
router.patch('/', updatePersona)

module.exports = router
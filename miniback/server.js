
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const categoriaRoutes = require('./routes/categoria')
const personaRoutes = require('./routes/persona')
const reservaRoutes = require('./routes/reserva')
const fichaRoutes = require('./routes/ficha')

// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/categoria', categoriaRoutes)
app.use('/api/persona', personaRoutes)
app.use('/api/reserva', reservaRoutes)
app.use('/api/ficha', fichaRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database')
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  }) 


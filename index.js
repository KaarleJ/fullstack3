require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person.js')
app.use(express.static('build'))
app.use(express.json())
morgan.token('data', (req) => JSON.stringify(req.body) )
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  }).catch(error => next(error))
})

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(result => {
    console.log(result)
    res.json(result)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  }).catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person.countDocuments({}).then(count => {
    res.send(res.send(`<div><p>Phone book has info for ${count} people<p/><p>${new Date()}<p/>`))
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id).then(result => {
    console.log(result)
    res.status(204).end()
  }).catch(error => next(error))
})


app.put('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndUpdate(req.params.id, { number: req.body.number }, { new: true  , runValidators: true, contect: 'query' }).then(updatedNote => {
    res.json(updatedNote)
  }).catch(error => next(error))
})

const unknownEndpoint = (req,res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
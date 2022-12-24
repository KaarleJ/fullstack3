require('dotenv').config()
const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person.js')
app.use(express.json())
app.use(express.static('build'))

morgan.token('data', (req, res) => JSON.stringify(req.body) )
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        console.log(result)
        
        res.json(result)
    })
})

app.get('/api/persons/:id', (req, res) => {
    
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
})

app.get('/info', (req, res) => {
    Person.countDocuments((error, count) => {
        if (error) {
            console.log(error)
            res.status(400).json(error)
        } else {
            console.log(count)
            res.send(`<div><p>Phone book has info for ${count} people<p/><p>${new Date()}<p/>`)
        }
    })
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findOneAndDelete({_id: req.params.id}, (error, doc) => {
        if (error) {
            console.log(error)
            res.status(400).json(error)
        } else {
            console.log(doc)
            res.status(204).end()
        }
    })
})


app.put('/api/persons/:id', (req, res) => {
    const number = req.body.number
    const id = req.params.id
    
    Person.findOneAndUpdate({_id: id}, {number: number}, {new: true  }, (error, doc) => {
        if (error) {
            console.log(error)
            res.status(400).json(error)       
        } else {
            console.log(doc)
            res.json(doc)
        }
    })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
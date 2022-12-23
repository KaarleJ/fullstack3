const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(express.static('build'))

morgan.token('data', (req, res) => JSON.stringify(req.body) )
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    {
        id : 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id : 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id : 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id : 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const person = persons.find(person => person.id === Number(req.params.id))

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    res.send(`<div><p>Phone book has info for ${persons.length} people<p/><p>${new Date()}<p/>`)
})

app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter(person => person.id !== Number(req.params.id))

    res.status(204).end()
})

const verify = ({number, name}) => {
    if (persons.map(person => person.name).includes(name)) {
        return {error: true, msg: "name must be unique"}
    }
    if (!number) {
        return {error: true, msg: "missing number"}
    }
    if (!name) {
        return {error: true, msg: "missing name"}
    }
    return {error: false, msg: null}
}

app.put('/api/persons/:id', (req, res) => {
    const number = req.body.number
    const id = req.params.id
    
    if (!persons.map(person => person.id).includes(Number(id))) {
        return res.status(400).json({
            error: "No persons with parameter id"
        })
    }

    const personNew = persons.find(person => person.id === id)
    personNew.number = number

    res.json(person)
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    
    const result = verify(body)
    if (result.error) {
        return res.status(400).json({
            error: result.msg
        })
    }

    const person = {
        id: Math.floor(Math.random()*9999999999),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    res.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
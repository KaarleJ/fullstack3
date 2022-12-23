const mongoose = require('mongoose')
if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }
  
const password = process.argv[2]
  
const url =
`mongodb+srv://fullstack:${password}@cluster0.e9ftcyh.mongodb.net/persons?retryWrites=true&w=majority`
  
mongoose.connect(url)
  
const personSchema = new mongoose.Schema({
name: String,
number: String,
})
  
const Person = mongoose.model('Person', personSchema)
  
if (process.argv.length>3) {
    console.log('adding new person')
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      })
      
    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
    console.log('succesful')
} else {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
    })
}
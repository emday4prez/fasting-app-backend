const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}


morgan.token('person', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.use(express.json())

app.use(requestLogger)


let fastingHistory = [
 {
  id:1,
  endDate: "06/14/2022",
  hours: 14,
  userName:"emday4prez"
 }, 
 {
  id:2,
  endDate: "07/12/2022",
  hours: 15,
  userName:"emday4prez"
 }
]
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.get('/', (request, response) => {
 response.send('<h1>hello world</h1>')
})
app.get('/info', (request, response) => {
 response.send(`<h4>${new Date()}</h4>`)
})

app.get('/api/history', (request, response) => {
 response.json(fastingHistory)
})

app.get('/api/history/:id', (request, response) => {
  const id = +request.params.id
  const individualFast = fastingHistory.find(fast => fast.id === id)
  if(individualFast){
   response.json(individualFast)
  }else{
   response.status(404).end()
  }
})

app.delete('/api/history/:id', (request, response) => {
 const id = +request.params.id
 fastingHistory = fastingHistory.filter(fast => fast.id !== id)
 response.status(200).end()
})

app.post('/api/history', (request, response) => {
 const body = request.body

 if(!body.hours){
  return response.status(400).json({
   error: 'duration missing'
  })
 }

 const fastToSave = {
  endDate: body.endDate || new Date(),
  hours: body.hours,
  id: generateId()
 }

 fastingHistory = fastingHistory.concat(fastToSave)

 response.json(fastToSave)
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }

  next(error)
}
app.use(errorHandler)

const PORT = 3001
app.listen(PORT)
console.log(`server running on port ${PORT}`)
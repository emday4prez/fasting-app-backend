require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Fast = require('./models/fast')

app.use(cors())
app.use(express.static('build'))

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
      "id": 22860864061,
      "startDate": "2022-07-01T23:56:00.000Z",
      "endDate": "2022-07-02T16:55:00.000Z",
      "duration": {
        "years": 0,
        "months": 0,
        "days": 0,
        "hours": 16,
        "minutes": 59,
        "seconds": 0
      },
      "hours": 17
    },
    {
      "id": 7750554688,
      "startDate": "2022-07-19T10:29:17.836Z",
      "endDate": "2022-07-20T11:29:00.000Z",
      "duration": {
        "years": 0,
        "months": 0,
        "days": 0,
        "hours": 13,
        "minutes": 59,
        "seconds": 42
      },
      "hours": 8
    },
    {
      "id": 27083658121,
      "startDate": "2022-06-22T00:30:00.000Z",
      "endDate": "2022-06-22T18:00:00.000Z",
      "duration": {
        "years": 0,
        "months": 0,
        "days": 0,
        "hours": 17,
        "minutes": 30,
        "seconds": 0
      },
      "hours": 18
    },
    {
      "id": 23867644132,
      "startDate": "2022-06-22T23:30:00.000Z",
      "endDate": "2022-06-23T21:30:00.000Z",
      "duration": {
        "years": 0,
        "months": 0,
        "days": 0,
        "hours": 22,
        "minutes": 0,
        "seconds": 0
      },
      "hours": 22
    },
    {
      "id": 8669837737,
      "startDate": "2022-06-24T00:14:00.000Z",
      "endDate": "2022-06-24T18:00:00.000Z",
      "duration": {
        "years": 0,
        "months": 0,
        "days": 0,
        "hours": 17,
        "minutes": 46,
        "seconds": 0
      },
      "hours": 18
    },
    {
      "id": 17226973181,
      "startDate": "2022-06-24T23:30:00.000Z",
      "endDate": "2022-06-25T15:30:00.000Z",
      "duration": {
        "years": 0,
        "months": 0,
        "days": 0,
        "hours": 16,
        "minutes": 0,
        "seconds": 0
      },
      "hours": 16
    },
    {
      "id": 7544708881,
      "startDate": "2022-06-27T01:00:00.000Z",
      "endDate": "2022-06-27T17:08:00.000Z",
      "duration": {
        "years": 0,
        "months": 0,
        "days": 0,
        "hours": 16,
        "minutes": 8,
        "seconds": 0
      },
      "hours": 16
    },
    {
      "id": 11815111735,
      "startDate": "2022-06-28T00:00:00.000Z",
      "endDate": "2022-06-28T18:00:00.000Z",
      "duration": {
        "years": 0,
        "months": 0,
        "days": 0,
        "hours": 18,
        "minutes": 0,
        "seconds": 0
      },
      "hours": 18
    },
    {
      "id": 24749605378,
      "startDate": "2022-06-29T00:03:00.000Z",
      "endDate": "2022-06-29T16:00:00.000Z",
      "duration": {
        "years": 0,
        "months": 0,
        "days": 0,
        "hours": 15,
        "minutes": 57,
        "seconds": 0
      },
      "hours": 16
    },
    {
      "id": 16633980658,
      "startDate": "2022-06-30T01:08:00.000Z",
      "endDate": "2022-06-30T18:04:00.000Z",
      "duration": {
        "years": 0,
        "months": 0,
        "days": 0,
        "hours": 16,
        "minutes": 56,
        "seconds": 0
      },
      "hours": 17
    },
    {
      "id": 22742282996,
      "startDate": "2022-07-23T00:00:00.000Z",
      "endDate": "2022-07-23T17:28:48.028Z",
      "duration": {
        "years": 0,
        "months": 0,
        "days": 0,
        "hours": 17,
        "minutes": 28,
        "seconds": 48
      },
      "hours": 17
    }
  ]


const generateId = () => {
  const maxId = fastingHistory.length > 0
    ? Math.max(...fastingHistory.map(n => n.id))
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
  

  Fast.find({}).then(fastingHistory => {
    response.json(fastingHistory)
  })

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
  Fast.findById(request.params.id).then(fast => {
    response.json(fast)
  })
})

app.post('/api/history', (request, response) => {
const body = request.body

  if(body.endDate === undefined){
    return response.status(400).json({error: 'date missing'})
  }

  const fast = new Fast({
    startDate: body.startDate,
    endDate: body.endDate,
    duration: body.duration,
    hours: body.hours
  })

  fast.save().then(savedFast => {
    response.json(savedFast)
  })
})

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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`server running on port ${PORT}`)
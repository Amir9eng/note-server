require("dotenv").config()

const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const app = express()
const Note = require("./models/note")

app.use(morgan("tiny"))
app.use(cors())
app.use(express.json())
app.use(express.static("build"))

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
]
app.post("/api/notes", (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  }

  next(error)
}

app.use(errorHandler)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.get("/", (request, response, next) => {
  response.end("<h1>Hello Mukhtar</h1>")
})

app.get("/api/notes/:id", (request, response) => {
  notes
    .findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0
  return maxId + 1
}

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id)
  const note = notes.filter((note) => note.id !== id)
  console.log(note)
  response.json(note).status(204).end()
})

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes)
  })
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  )
  process.exit(2)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.bi019.mongodb.net/NotesDb?retryWrites=true&w=majority`

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model("Note", noteSchema)

const note = new Note({
  content: "Javascript is Easy",
  date: new Date(),
  important: true,
})
Note.find({}).then((result) => {
  result.forEach((note) => {
    return console.log(note)
  })
  mongoose.connection.close()
})

note.save().then((result) => {
  console.log("note has been saved!")
  mongoose.connection.close()
})

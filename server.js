const express = require('express')
const fs = require('fs')
const path = require('path')
const {notes}  = require('./db/db')

const { v4: uuidv4 } = require('uuid')

const PORT = process.env.PORT || 3001
const app = express()

app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(express.static('public'))

function createNewNote (body, notesArray) {
    let newNote = body
    notesArray.push(newNote)
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({notes: notesArray}, null, 2)
    )

}

function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') {
        return false
    }
    if (!note.text || typeof note.text !== 'string') {
        return false
    }
    return true
}

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

app.post('/api/notes', (req, res) => {
    req.body.id = uuidv4()

    if (!validateNote(req.body)) {
        res.status(400).send('The note is note formatted correctly')
    } else {
        const note = createNewNote(req.body, notes)
        res.json(note)
    }
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
})



app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`)
})
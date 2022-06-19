const express = require('express')
const fs = require('fs')
const path = require('path')
const {notes} = require('./db/db.json')

const PORT = process.env.PORT || 3001
const app = express()

app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(express.static('public'))

function createNewNote (body, notesArray) {
    const note = body
    notesArray.push(note)
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray}, null, 2)
    )
    return note
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

app.get('/api/db', (req, res) => {
    const results = notes
    res.json(results)
})

app.post('/api/db', (req, res) => {
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



app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`)
})

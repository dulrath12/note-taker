const express = require('express')
const fs = require('fs')
const path = require('path')
const notes = require('./db/db.json')

const PATH = process.env.PORT || 3001
const app = express()

app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(express.static('public'))

const express = require('express')
const app = express()

const userDB = require('./user_data.json')
app.use(express.json())
const PORT = process.env.PORT || 5000

app.use((req, res, next) => {
    console.log(req.body.email, req.url)
    // res.status(500).send('Server under maintenance')
    next()
})

app.get('/users', (req, res) => {
    res.status(200).send(userDB)
})

app.get('/users/:id', (req, res) => {
    const user = userDB.filter(user => user._id === req.params.id)

    if (user.length === 0)
        res.status(404).send()
    else
        res.send(user)
})

app.post('/users/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const user = userDB.filter(user => user.email === email)

    if (user.length === 0)
        res.status(404).send()
    else {
        if (user[0].password === password)
            res.send(user)
        else
            res.status(401).send('email and password mismatch')
    }
})

app.post('/users', (req, res) => {
    userDB.push(req.body)
    res.status(201).send()
})

app.patch('/users/:id', (req, res) => {
    const updateKeys = Object.keys(req.body)

    userDB.forEach(user => {
        if (user._id === req.params.id) {
            updateKeys.forEach(key => user[key] = req.body[key])
            res.send(user)
        }
    })
})

app.delete('/users/:id', (req, res) => {

    userDB.forEach((user, i) => {
        if (user._id === req.params.id) {
            const deletedUser = userDB.splice(i, 1)
            res.send(deletedUser)
        }
    })
})

app.use((req, res, next) => {
    res.status(404).send("Resource not found")
})

app.listen(PORT, () => {
    console.log('App is running on', PORT)
})
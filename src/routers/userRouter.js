const express = require ('express')
const app = new express.Router()
const User = require ('../models/user')

app.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

app.post ('/users/login', async (req, res) => {
    const _email = req.body.email
    const _password = req.body.password

    try {
        const user = await User.checkCredentials (_email, _password)
        const token = await user.generateAuthToken ()
        res.send ({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

app.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

app.patch ('/users/:id', async (req, res) => {
    const updates = Object.keys (req.body)
    const allowedUpdates = ['age','name','email','password']

    let validateUpdates = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!validateUpdates) return res.status(404).send({error:'Invalid udpate'})
    
    try {
        const user = await User.findById(req.params.id)
        updates.forEach ((update) => {
            user[update] = req.body[update]
        })
        await user.save()
        if (!user) res.status(400).send()
        res.send(user)
    } catch (e) {
        res.status(404).send(e)
    }
})

app.delete ('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) return res.status(404).send()
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = app

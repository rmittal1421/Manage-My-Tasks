const express = require ('express')
const app = new express.Router()
const User = require ('../models/user')

app.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
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
    try {
        const updates = Object.keys (req.body)
        const allowedUpdates = ['age','name','email','password']

        let validateUpdates = updates.every((update) => {
            return allowedUpdates.includes(update)
        })

        if (!validateUpdates) return res.status(404).send({error:'Invalid udpate'})

        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true })
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

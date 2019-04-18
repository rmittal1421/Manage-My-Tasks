const express = require ('express')
const app = new express.Router()
const auth = require ('../middleware//auth')
const Task = require ('../models/task')

app.post('/tasks', auth, async (req, res) => {
    const task = new Task ({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//GET /tasks?complete=true||false
app.get('/tasks', auth, async (req, res) => {
    match = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    try {
        await req.user.populate({
            path : 'tasks', 
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

app.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({_id, owner:req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.patch ('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']

    let validateUpdate = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!validateUpdate) return res.status(404).send({error:'Invalid update'})

    try {
        const task = await Task.findOne ({_id:req.params.id, owner:req.user._id})
        if (!task) return res.status(404).send()

        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.delete ('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete ({_id:req.params.id, owner:req.user._id})
        if (!task) return res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = app
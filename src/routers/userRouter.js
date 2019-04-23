const express = require ('express')
const app = new express.Router()
const User = require ('../models/user')
const auth = require ('../middleware/auth')
const multer = require ('multer')

const upload = multer ({
    limits: {
        fileSize: 3000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            cb (new Error ('Please upload only an image with extension of either png or jpg'))
        }
        cb (undefined, true)
    }
})

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

app.post ('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter ((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

app.post ('/users/logoutAll', auth, async (req, res) => {
    let validUser = false
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
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

app.get ('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

app.get('/users/:id', auth, async (req, res) => {
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

app.patch ('/users/me', auth, async (req, res) => {
    const updates = Object.keys (req.body)
    const allowedUpdates = ['age','name','email','password']

    let validateUpdates = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!validateUpdates) return res.status(404).send({error:'Invalid udpate'})
    
    try {
        updates.forEach ((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(404).send(e)
    }
})

app.delete ('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

app.post ('/users/me/avatar', auth, upload.single ('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send ('The image has been correctly posted')
}, (error, req, res, next) => {
    res.status (400).send ({ error : error.message })
})

app.delete ('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send ()
})

app.get ('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById (req.params.id)
        if (!user || !user.avatar) throw new Error ('Nothing found')
        res.set ('Content-Type', 'image/png')
        res.send (user.avatar)
    } catch (e) {
        res.status (404).send (e)
    }
})

module.exports = app

const express = require('express')
require('./db/mongoose')

const app = express()
const userRouter = require ('./routers/userRouter')
const taskRouter = require ('./routers/taskRouter')

const port = process.env.PORT

// app.use ((req, res, next) => {
//     res.status(503).send('The website is in maintanence mode')
// })

app.use(express.json())
app.use (userRouter)
app.use (taskRouter)

app.get ('', (req, res) => {
    res.send ('Hello there!')
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
const express = require('express')
require('./db/mongoose')
const Task = require('./models/task')

const app = express()
const userRouter = require ('./routers/userRouter')
const taskRouter = require ('./routers/taskRouter')

const port = process.env.PORT || 3000

app.use(express.json())
app.use (userRouter)
app.use (taskRouter)

app.get ('', (req, res) => {
    res.send ('Hello there!')
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
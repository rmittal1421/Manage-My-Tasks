const express = require('express')
require('./db/mongoose')

const app = express()
const userRouter = require ('./routers/userRouter')
const taskRouter = require ('./routers/taskRouter')

const port = process.env.PORT || 3000

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

// const User = require ('./models/user')
// const Task = require ('./models/task')

// const main = async () => {
//     // const task = await Task.findById('5cb8c2bd203de333e018098e')
//     // await task.populate('owner').execPopulate()
//     // console.log(task)

//     const user = await User.findById ('5cb8b8a0a787e86194a96cab')
//     await user.populate('tasks').execPopulate()
//     console.log (user.tasks)
// }

// main ()
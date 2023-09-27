io = require('socket.io')()
const auth = require('./middlewares/auth')

io.use(auth.socket)
io.on('connection', socket => {
    console.log('New Client'+ socket.id)
})
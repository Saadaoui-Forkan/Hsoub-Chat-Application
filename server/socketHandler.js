io = require('socket.io')()

io.on('connection', socket => {
    console.log('New Client'+ socket.id)
})
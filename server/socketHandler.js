io = require('socket.io')()
const auth = require('./middlewares/auth')
const Message = require('./models/message');
const User = require('./models/user');

io.use(auth.socket)

io.on('connection', socket => {
    console.log('New Client'+ socket.id)
    initialData(socket)
})

// Get all user messages.
const getMessages = (userId) => {
    let where = [{ sender: userId }, { receiver: userId }];
    return Message.find().or(where);
};

// Get all users except the connected user
const getUsers = (userId) => {
    let where = {
      _id: { $ne: userId },
    };
    return User.find(where).select("-password");
};

//Initialize user data after connection
const initialData = (socket) => {
    let user = socket.user;
    let messages = [];
    getMessages(user.id)
      .then((data) => {
        messages = data;
        return getUsers(user.id);
      })
      .then((contacts) => {
        socket.emit("data", user, contacts, messages, users);
      })
      .catch(() => socket.disconnect());
};
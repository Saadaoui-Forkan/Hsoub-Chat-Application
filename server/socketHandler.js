io = require('socket.io')()
const auth = require('./middlewares/auth')
const Message = require('./models/message');
const User = require('./models/user');

const users = {}

io.use(auth.socket)

io.on('connection', socket => {
    onSocketConnected(socket);
    socket.on('message', data => onMessage(socket, data))
    socket.on('typing', receiver => onTyping(socket, receiver))
    socket.on('seen', sender => onSeen(socket, sender));
    // console.log('New Client'+ socket.id)
    initialData(socket)
    socket.on('disconnect', () => onSocketDisconnected(socket));
})

// Connection Handling
const onSocketConnected = socket => {
  // Log socket.id to console.
  console.log('New client connected: ' + socket.id);
  // Add newly connected socket to user room.
  socket.join(socket.user.id);
  // Make user status online.
  users[socket.user.id] = true;
  // If this connection is the first one for user then broadcast user online to others.
  let room = io.sockets.adapter.rooms[socket.user.id];
  if(!room || room.length === 1){
      io.emit('user_status', {
        [socket.user.id]: true  
      })
  }
};

const onMessage = (socket, data) => {
  // Get sender id.
  let sender = socket.user.id;
  // Get receiver id.
  let receiver = data.receiver;
  // Make message object.
  let message = {
      sender: sender, receiver: receiver, content: data.content, date: new Date().getTime()
  };
  // Add message to database.
  Message.create(message);
  // Send message to receiver and sender applications (browsers or windows).
  socket.to(receiver).to(sender).emit('message', message);
};

// Typing Message
const onTyping = (socket, receiver) => {
  let sender = socket.user.id;
  socket.to(receiver).emit('typing', sender);
};

// Handle Message Seen Event
const onSeen = (socket, sender) => {
  let receiver = socket.user.id;
  console.log({sender, receiver, seen: false});
  Message.updateMany({sender, receiver, seen: false}, {seen: true}, {multi: true}).exec();
};

// Get all user messages.
const getMessages = userId => {
  let where = [
      {sender: userId}, {receiver: userId}
  ];
  return Message.find().or(where);
};

// Get all users except the connected user
const getUsers = userId => {
  let where = {
      _id: {$ne: userId}
  };
  return User.find(where).select('-password');
};

//Initialize user data after connection
const initialData = socket => {
  let user = socket.user;
  let messages = [];
  getMessages(user.id)
  .then(data => {
      messages = data;
      return getUsers(user.id);
  })
  .then(contacts => {
      socket.emit('data', user, contacts, messages, users);
  })
  .catch(() => socket.disconnect());
};

// Disconnection Handling
const onSocketDisconnected = socket => {
  // If last connection for user then broadcast user last seen to others.
  let room = io.sockets.adapter.rooms[socket.user.id];
  if(!room || room.length < 1){
      let lastSeen = new Date().getTime();
      users[socket.user.id] = lastSeen;
      io.emit('user_status', {
          [socket.user.id]: lastSeen
      });
  }
  // Log user disconnected to console.
  console.log('Client disconnected: ' + socket.user.username);
};
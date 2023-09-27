const User = require('../models/user');
const createError = require('http-errors');

//Register.
exports.register = (req, res, next) => {
    let data = { name, username, password } = req.body

    User.findOne({username})
    .then(user => {
        if(user) throw createError(422, "اسم المستخدم موجود مسبقاً")
        return User.create(data)
    })
    .then(user => {
        res.json(user.signJwt())
        sendNewUser(user);
    })
    .catch(next);
};

const sendNewUser = user => {
    let data = { name, username, avatar } = user;
    io.emit('new_user', data);
};

//Login
exports.login = (req, res, next) => {
    let { username, password } = req.body

    User.findOne({username})
    .then(user => {
        if(!user || !user.checkPassword(password)) {            
            throw createError(401, "يرجى التحقق من اسم المستخدم وكلمة المرور")
        }        
        res.json(user.signJwt())
    })
    .catch(next);
};



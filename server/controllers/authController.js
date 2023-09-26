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
        // Generate user token.
        res.json(user.signJwt())
        // Broadcast created user profile to users.
        sendNewUser(user);
    })
    .catch(next);
};


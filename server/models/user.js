const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const ModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 20
    },
    password: {
        type: String,
        required: true
    },
    about: {
        type: String,
        maxlength: 100
    },
    avatar: String,
});

// Hash Password
ModelSchema.pre('save', function(next){
    if(this.isNew || this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, 8);
    }
    next();
});

ModelSchema.methods.getData = function(){
    return {
        id: this._id,
        name: this.name,
        username: this.username,
        about: this.about,
        avatar: this.avatar
    };
};

//Generate user token with profile data.
ModelSchema.methods.signJwt = function(){
    let data = this.getData();
    data.token = jwt.sign(data, process.env.JWT_SECRET);
    return data;
};

ModelSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

// Verify Password
ModelSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}


const Model = mongoose.model('User', ModelSchema);
module.exports = Model;
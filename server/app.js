require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Express Application
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Errors handling
 */
app.use((err, req, res, next) => {
    if(err.name === 'MongoError' || err.name === 'ValidationError' || err.name === 'CastError'){
        err.status = 422;
    }
    if(req.get('accept').includes('json')){
        res.status(err.status || 500).json({message: err.message || 'some error eccured.'});
    } else {
        res.status(err.status || 500).sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});


module.exports = app;

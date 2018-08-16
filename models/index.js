const mongoose = require('mongoose');
mongoose.set('debug', true);

const url = 'mongodb://localhost:27017/movie-db';
mongoose.connect(url);
mongoose.Promise = global.Promise;

module.exports.User = require('./users');
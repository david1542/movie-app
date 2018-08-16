const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamps');

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        trim: true
    }
});

UserSchema.plugin(timestamps);

module.exports = mongoose.model('User', UserSchema);
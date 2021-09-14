const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username:  {type: String, required: true}, // String is shorthand for {type: String}
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);
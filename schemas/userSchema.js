const { Mongoose } = require("mongoose")

const mongoose = require('mongoose');

//Creating user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }

});

//Save the user schema as the model for objects of collection users.
const User = mongoose.model('users', userSchema);

module.exports = User;
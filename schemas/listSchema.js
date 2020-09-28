const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    createData:{
        type: Date,
        default: Date.now
    },
    tasks: {
        type: Array
    }
})

const List = mongoose.model('lists', listSchema);

module.exports = List;
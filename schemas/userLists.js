const mongoose = require('mongoose');

const userListSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    lists: {
        type: Array
    }
})

const List = mongoose.model('lists', userListSchema);

module.exports = List;
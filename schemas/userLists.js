const mongoose = require('mongoose');

const userListSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    listsNames: {
        type: Array
    },
    lists: {
        type: Array
    }
})

const List = mongoose.model('lists', userListSchema);

module.exports = List;
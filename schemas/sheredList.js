const mongoose = require('mongoose');

const sheredListSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    owners: {
        type: Array,
        require: true
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    tasks: {
        type: Array
    }
})

const sheredList = mongoose.model('sheredLists', sheredListSchema);

module.exports = sheredList;
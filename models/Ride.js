const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    trideId: {
        type: String,
        default: ''
    },
    service: {
        type: String,
        default: ''
    },
    requestId: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'processing'
    },
    data: {
        type: String,
        default: '{}'
    }
})

module.exports = mongoose.model('Ride', schema)
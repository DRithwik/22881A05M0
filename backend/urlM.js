const mongoose = require('mongoose');

const  urlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    short: {
        type: String,
        unique: true,
    },
    expiry: {
        type: Date
    }
});

module.exports = mongoose.model('Url', urlSchema);  

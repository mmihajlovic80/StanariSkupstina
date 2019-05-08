const mongoose = require('mongoose');
const helper = require('../helper_functions/functions');
// User Schema
const UserSchema = mongoose.Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: helper.getCurrentDate()
    }
});

const User = module.exports = mongoose.model('korisnici_novo', UserSchema);

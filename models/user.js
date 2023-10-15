const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    birthday: Date,
    image: String,
});

module.exports = mongoose.model('user', userSchema)
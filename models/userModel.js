const {Schema, model, default: mongoose} = require('mongoose')

const userSchema = new Schema({
    firstName: {type: String, required: true, unique: false},
    lastName: {type: String, required: true,  unique: false},
    userName: {type: String, required:[ true, 'Please enter a valid email address'], unique: true},
    email: {type: String, required: true, unique: true,},
    password: {type: String, required: true},
    avatar: {type: String,
        default: 'https://i.ibb.co/4pDNDk1/avatar.png'
    },
},{timestamps:true})

const Users = mongoose.model('User', userSchema)

module.exports = Users
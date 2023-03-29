const mongoose = require('mongoose')
const User = new mongoose.Schema(
    {
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true},
    roles : [{type: String,default: "User"}]
    },
    {
        cellection : 'user-data'
    }
)

const model = mongoose.model('UserData',User)

model.exports = model
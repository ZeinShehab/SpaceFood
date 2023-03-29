const User = require('../models/User')

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

const getAllusers = asyncHandler (async (req,res) => {
    const users = await User.find().select('-password').lean()
    if(!users){
        return res.status(400).json({message:'no users found'})
    }
    res.json(users)
})


const createNewUser = asyncHandler (async (req,res) => {
    const {username,password,roles} = req.body

    if(!username || !password || Array.isArray(roles) || !roles.length){
        return res.status(400).json({message: 'All fields are required'})
    }
    const duplicate = await User.findOne({username }).lean().exec()

    if (duplicate){
        return res.status(409).json({message: 'duplicate Username'})
    }

    const hashedPwd = await bcrypt.hash(password,10)

    const userObject = {username, "password" : hashedPwd , roles}

    const user = await User.create(userObject)

    if(user){
        res.status(201).json({message: `new user ${username} created `})
    }else{
        res.status(400).json({message: "Invalid user data recieved"})
    }
})


const updateUser = asyncHandler (async (req,res) => {
    const {id, username, roles, password} = req.body

    if( !id || !username || Array.isArray(roles) || !roles.length ){
        return res.status(400).json({message: 'All fields are required'})
    }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message: 'user not found'})
    }
    const duplicate = await User.findOne({username }).lean().exec()

    if( duplicate && duplicate?._id.toString() !== id){
        return res.status(400).json({message: 'duplicate username'})
    }
    user.username = username
    user.roles = roles
    
    if(password){
        user.password = await bcrypt.hash(password, 10)
    }

    const updateUser = await user.save()

    res.json({message: `updates ${updateUser.username} updated`})
})


const deleteUser = asyncHandler (async (req,res) => {
    const { id} = req.body

    if(!id){
        return res.status(400).json({message: 'User id is required'})
    }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message: 'user not found'})
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with id ${result.id} deleted`

    res.json(reply)
})

module.exports = {
    getAllusers,
    createNewUser,
    updateUser,
    deleteUser
}
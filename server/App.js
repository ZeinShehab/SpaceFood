//import modules
const express       = require('express')
const mongoose      = require('mongoose')
const morgan        = require('morgan')
const cors          = require('cors')

// const cookieParser = require('cookie-parser')
const path = require('path')
require('dotenv').config()



//App 
const app =express()




//DB
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    UseUnifiedTopology: true,

}).then(()=> console.log('DataBase Connected')).catch((err) => console.log('DB connection error', err))




//middleware
app.use(morgan('dev'))
app.use(cors({origin:true, credentials:true}))
app.use(express.json())
app.use('/',express.static('public'))
app.use('/',require('./routes/root'))
app.use('/users',require('./routes/userRoutes'))
app.use('/auth', require('./routes/authRoutes'))
// app.use(cookieParser())
//routes
// app.post('/api/register', async (req,res)=>{
//     res.json({status:'ok'})

//     try{
//         await User.create({
//             name:req.body.name,
//             email: req.body.email,
//             password: req.body.password
//         })
//         res.json({status:'ok'})
//     }catch(err){
//         res.json({status:'error', error:'Duplicate email'})
//     }
// })

// app.post('/api/login', async (req,res)=>{
//     res.json({status:'ok'})

//     const user = await User.findOne({email:req.body.email, password: req.body.password})
//     res.json({status:'ok'})

//     if (user){
//         return res.json({status: 'ok', user: true})
//     }else{
//         return res.json({status: 'error', user: false})
//     }
// })



//ports
const port = process.env.PORT || 3500;



//listener
const server = app.listen(port, () => console.log(`Server is running on port ${port}`))

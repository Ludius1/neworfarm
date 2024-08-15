const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()
const connectDb = require('./config/db')
// const upload = require('express-fileupload')

const userRoutes = require('./routes/userRoutes')
const productRoutes = require ('./routes/productRoutes')


const app = express()
app.use(express.json({extended: true}))
app.use(express.urlencoded({extended: true})) 
app.use(cors())
// app.use(upload())
// app.use('/uploads', express.static(__dirname + '/uploads'))
connectDb() 
  

const port = process.env.PORT || 5000 
const baseUrl = '/api/v1'
app.use(`${baseUrl}/user`, userRoutes)
app.use(`${baseUrl}/products`, productRoutes)


app.listen(port, () =>console.log( `Server is runnig at ${port}`))

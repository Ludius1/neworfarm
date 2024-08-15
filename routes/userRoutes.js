const express = require ('express')
const {registerUser, loginUser, getUser, changeAvatar, upDateUser,userloginStatus, editProfile} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('.././middleware/multer')

 
const userRoutes =  express.Router()

userRoutes.post('/signup', registerUser)
userRoutes.post('/login', loginUser)
userRoutes.get('/getuser', protect, getUser)
userRoutes.get('/userloginStatus', protect, userloginStatus)
userRoutes.patch('/update-user', protect, upDateUser)
userRoutes.post('/change-avatar', protect, upload.single('avatar'), changeAvatar)
    

module.exports = userRoutes


 

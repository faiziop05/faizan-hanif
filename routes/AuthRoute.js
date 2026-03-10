const express=require('express')
const { LoginUser } = require('../contollers/AuthController')
const router=express.Router()


router.post('/signin',LoginUser)


module.exports=router
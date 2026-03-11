const express=require('express')
const { LoginUser, refreshAuthToken } = require('../contollers/AuthController');
const { verifyToken } = require('../middlewhere/authMiddleware');
const router=express.Router()


router.post('/signin',LoginUser)
router.get('/refresh', verifyToken, refreshAuthToken);

module.exports=router
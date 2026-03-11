const express=require('express')
const { subscribeWebhook } = require('../contollers/WebhookController');
const router=express.Router()


router.post("/subscribe", subscribeWebhook);


module.exports=router
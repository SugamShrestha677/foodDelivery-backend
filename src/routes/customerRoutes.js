const express = require('express');
const {register, login, getAllCustomers} = require('../controllers/customerController')                                                                      
const router = express.Router();
const customerController = require("../controllers/customerController")

router.get('/allCustomers', customerController.getAllCustomers);
router.post('/register', customerController.register);
router.post('/login', customerController.login);
router.post('/login/', customerController.login);
module.exports=router;
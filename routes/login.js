
const express = require('express');

const loginController = require('../controllers/login')

const router = express.Router();


router.get('/', loginController.first_route);
router.get('/login', loginController.login);
router.post('/vertify_login', loginController.vertify_login);



module.exports = router;


const express = require('express');

const slamController = require('../controllers/slam')

const router = express.Router();


router.get('/', slamController.slam); 
router.post('/save_map', slamController.save_map); 
router.post('/launch_slam', slamController.save_map); 


module.exports = router;

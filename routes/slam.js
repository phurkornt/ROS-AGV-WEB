
const express = require('express');

const slamController = require('../controllers/slam')

const router = express.Router();


router.get('/', slamController.slam); 
router.post('/save_map', slamController.save_map); 
router.post('/launch_slam', slamController.launch_slam); 


module.exports = router;

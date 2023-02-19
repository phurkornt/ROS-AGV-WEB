
const express = require('express');

const createNavController = require('../controllers/createNav')

const router = express.Router();

router.get('/', createNavController.createNav);
router.post('/launch_map', createNavController.launch_map);

module.exports = router;
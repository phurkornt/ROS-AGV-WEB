
const express = require('express');

const createNavController = require('../controllers/createNav')

const router = express.Router();

router.get('/', createNavController.createNav);
router.post('/launch_map', createNavController.launch_map);
router.post('/insert_room', createNavController.insert_room);

router.get('/delete_room', createNavController.delete_room);
router.get('/nav_room', createNavController.nav_room);


router.get('/insert_nav', createNavController.insert_nav);
router.get('/delete_nav', createNavController.delete_nav);
router.get('/update_nav', createNavController.update_nav);

router.post('/insert_nav_action', createNavController.insert_nav_action);
router.post('/update_nav_action', createNavController.update_nav_action);






module.exports = router;
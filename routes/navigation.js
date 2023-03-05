
const express = require('express');

const navController = require('../controllers/navigation')

const router = express.Router();


router.get('/', navController.navigation);
router.post('/launch_nav', navController.launch_nav);
router.post('/insert', navController.insert_post);
router.get('/insert', navController.insert_get);
router.post('/delete', navController.delete);

router.post('/update', navController.update_post);
router.get('/update', navController.update_get);

router.get('/moving/:pos', navController.move);

router.get('/get_navroom', navController.get_navroom);

router.get('/move', navController.navigation_move);

// router.get('/init_pose', navController.init_pose);
// router.get('/login', loginController.login);

router.post('/move', navController.navigation_moving);



module.exports = router;
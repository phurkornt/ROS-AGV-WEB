
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

router.get('/move/:pos', navController.move);

// router.get('/login', loginController.login);

module.exports = router;

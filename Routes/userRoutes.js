const express = require('express');
const router = express.Router();
const { signup, login , getAllUsers} = require('../Controller/userController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/getAll', getAllUsers);
module.exports = router;

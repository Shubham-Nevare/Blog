const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/count', userController.getTotalUsers);
router.get('/all', userController.getAllUsers);
router.delete('/:id', userController.deleteUser);
router.put('/:id/status', userController.updateUserStatus);
router.put('/:id', userController.updateUser);

module.exports = router;
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET all users
router.get('/', userController.getAll);

// GET user by ID
router.get('/:id', userController.get);

// POST add new user
router.post('/', userController.post);

// PUT update user
router.put('/:id', userController.put);

// DELETE user
router.delete('/:id', userController.delete);

module.exports = router;

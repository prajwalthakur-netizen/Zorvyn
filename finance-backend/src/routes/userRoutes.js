const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const { getUsers, updateUser } = require('../controllers/userController');

router.get('/',      auth, roleGuard('admin'), getUsers);
router.patch('/:id', auth, roleGuard('admin'), updateUser);

module.exports = router;
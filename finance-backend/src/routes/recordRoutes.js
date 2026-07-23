const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord
} = require('../controllers/recordController');

router.get('/',     auth, roleGuard('viewer','analyst','admin'), getRecords);
router.get('/:id',  auth, roleGuard('viewer','analyst','admin'), getRecordById);
router.post('/',    auth, roleGuard('admin'), createRecord);
router.put('/:id',  auth, roleGuard('admin'), updateRecord);
router.delete('/:id', auth, roleGuard('admin'), deleteRecord);

module.exports = router;
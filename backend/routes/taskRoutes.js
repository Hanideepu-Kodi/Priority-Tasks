const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.post('/', auth, taskController.createTask);
router.get('/', auth, taskController.getTasks);
router.put('/:id', auth, taskController.updateTaskDetails);
router.patch('/:id/completed', auth, taskController.updateTaskCompleted);
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;

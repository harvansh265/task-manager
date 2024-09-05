const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { addTask , allTask , updateTask , deleteTask } = require('../controllers/task');

const router = express.Router();

router.post('/', authMiddleware, addTask);
router.get('/', authMiddleware, allTask);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;

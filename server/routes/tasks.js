// routes/tasks.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    toggleTask
} = require('../controllers/taskController');

// All routes are protected
router.use(auth);

// POST /api/tasks
router.post('/', createTask);

// GET /api/tasks
router.get('/', getTasks);

// PUT /api/tasks/:id
router.put('/:id', updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

// PATCH /api/tasks/:id/toggle
router.patch('/:id/toggle', toggleTask);

module.exports = router;

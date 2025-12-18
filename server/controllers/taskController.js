const Task = require('../models/Task');

/**
 * Create a new task
 * POST /api/tasks
 * body: { title, description?, date? }
 */
exports.createTask = async (req, res) => {
    try {
        const { title, description = '', date } = req.body;
        if (!title) return res.status(400).json({ msg: 'Title is required' });

        const task = await Task.create({
            user: req.user,
            title,
            description,
            date: date ? new Date(date) : undefined
        });

        res.status(201).json(task);
    } catch (err) {
        console.error('createTask', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * Get tasks for current user
 * GET /api/tasks
 * optional query params: ?completed=true/false & ?date=YYYY-MM-DD
 */
exports.getTasks = async (req, res) => {
    try {
        const { completed, date } = req.query;
        const filter = { user: req.user };

        if (typeof completed !== 'undefined') {
            // query param is string "true" or "false"
            filter.completed = completed === 'true';
        }

        if (date) {
            // match tasks whose date is the same day
            const d = new Date(date);
            const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
            filter.date = { $gte: start, $lt: end };
        }

        const tasks = await Task.find(filter).sort({ date: 1, createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error('getTasks', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * Update a task
 * PUT /api/tasks/:id
 * body: { title?, description?, date?, completed? }
 */
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user });
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        const { title, description, date, completed } = req.body;
        if (typeof title !== 'undefined') task.title = title;
        if (typeof description !== 'undefined') task.description = description;
        if (typeof date !== 'undefined') task.date = date ? new Date(date) : undefined;
        if (typeof completed !== 'undefined') task.completed = completed;

        await task.save();
        res.json(task);
    } catch (err) {
        console.error('updateTask', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * Delete a task
 * DELETE /api/tasks/:id
 */
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user });
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        res.json({ msg: 'Task deleted' });
    } catch (err) {
        console.error('deleteTask', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * Toggle completed (shortcut)
 * PATCH /api/tasks/:id/toggle
 */
exports.toggleTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user });
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        task.completed = !task.completed;
        await task.save();
        res.json(task);
    } catch (err) {
        console.error('toggleTask', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

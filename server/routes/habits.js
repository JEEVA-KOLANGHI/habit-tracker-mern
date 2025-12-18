const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Habit = require('../models/Habit');

/**
 * GET all habits
 */
router.get('/', auth, async (req, res) => {
    try {
        const habits = await Habit.find({ user: req.user }).sort({ createdAt: -1 });
        res.json(habits);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

/**
 * CREATE habit
 */
router.post('/', auth, async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ msg: 'Title required' });
        }

        const habit = new Habit({
            user: req.user,
            title,
            completions: []
        });

        await habit.save();
        res.json(habit);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

/**
 * MARK HABIT DONE (TODAY)
 */
router.post('/:id/done', auth, async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!habit) {
            return res.status(404).json({ msg: 'Habit not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const alreadyDone = habit.completions.some(d => {
            const date = new Date(d);
            date.setHours(0, 0, 0, 0);
            return date.getTime() === today.getTime();
        });

        if (alreadyDone) {
            return res.status(400).json({ msg: 'Already done today' });
        }

        habit.completions.push(new Date());
        await habit.save();

        res.json(habit);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;

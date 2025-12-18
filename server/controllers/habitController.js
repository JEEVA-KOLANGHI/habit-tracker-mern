const Habit = require('../models/Habit');

// CREATE habit
exports.createHabit = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).json({ msg: 'Title is required' });

        const habit = await Habit.create({
            user: req.user,
            title,
            completions: []
        });

        res.status(201).json(habit);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// GET all habits
exports.getHabits = async (req, res) => {
    try {
        const habits = await Habit.find({ user: req.user });
        res.json(habits);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// MARK habit as done for today
exports.markDone = async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!habit) {
            return res.status(404).json({ msg: 'Habit not found' });
        }

        if (!habit.completedDates) {
            habit.completedDates = [];
        }

        const today = new Date().toDateString();

        const alreadyDone = habit.completedDates.some(
            d => new Date(d).toDateString() === today
        );

        if (!alreadyDone) {
            habit.completedDates.push(new Date());
            habit.currentStreak = (habit.currentStreak || 0) + 1;
            habit.lastCompleted = new Date();
            await habit.save();
        }

        res.json({ msg: 'Habit marked for today' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// GET habit stats (count + current streak)
exports.getStats = async (req, res) => {
    try {
        const habit = await Habit.findOne({ _id: req.params.id, user: req.user });
        if (!habit) return res.status(404).json({ msg: 'Habit not found' });

        const dates = habit.completions
            .map(d => {
                const dt = new Date(d);
                dt.setHours(0, 0, 0, 0);
                return dt.getTime();
            })
            .sort((a, b) => b - a); // latest first

        let streak = 0;
        let today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < dates.length; i++) {
            const expected = new Date(today);
            expected.setDate(today.getDate() - i);

            if (dates[i] === expected.getTime()) {
                streak++;
            } else {
                break;
            }
        }

        res.json({
            totalCount: dates.length,
            currentStreak: streak
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};
exports.undoHabit = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) {
            return res.status(404).json({ msg: 'Habit not found' });
        }

        const today = new Date().toDateString();

        habit.completedDates = habit.completedDates.filter(
            (d) => new Date(d).toDateString() !== today
        );

        await habit.save();
        res.json({ msg: 'Habit undone for today' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    completions: [
        {
            type: Date
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);

import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Habits = () => {
    const [habits, setHabits] = useState([]);
    const [title, setTitle] = useState('');
    const [loadingId, setLoadingId] = useState(null);

    useEffect(() => {
        fetchHabits();
    }, []);

    const fetchHabits = async () => {
        const res = await api.get('/habits');
        setHabits(res.data);
    };

    const addHabit = async () => {
        if (!title.trim()) return;
        const res = await api.post('/habits', { title });
        setHabits([res.data, ...habits]);
        setTitle('');
    };

    const markDone = async (id) => {
        try {
            setLoadingId(id);
            const res = await api.post(`/habits/${id}/done`);
            setHabits(habits.map(h => (h._id === id ? res.data : h)));
        } catch (err) {
            alert(err.response?.data?.msg || 'Error');
        } finally {
            setLoadingId(null);
        }
    };

    const todayDoneCount = habits.filter(h =>
        h.completions.some(d => {
            const a = new Date(d);
            const b = new Date();
            a.setHours(0, 0, 0, 0);
            b.setHours(0, 0, 0, 0);
            return a.getTime() === b.getTime();
        })
    ).length;

    const chartData = {
        labels: ['Completed', 'Remaining'],
        datasets: [
            {
                data: [todayDoneCount, habits.length - todayDoneCount],
                backgroundColor: ['#22c55e', '#e5e7eb'],
                borderWidth: 0
            }
        ]
    };

    return (
        <div className="habits-page">
            <h2 className="habits-title">Daily Habits</h2>

            {habits.length > 0 && (
                <div className="habits-dashboard">
                    <div className="habits-chart-card">
                        <Doughnut data={chartData} />
                        <p className="habits-chart-text">
                            {todayDoneCount} / {habits.length} completed today
                        </p>
                    </div>
                </div>
            )}

            <div className="habits-add-box">
                <input
                    className="habits-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a new habit"
                    onKeyDown={(e) => e.key === 'Enter' && addHabit()}
                />
                <button className="habits-add-btn" onClick={addHabit}>
                    Add
                </button>
            </div>

            <div className="habits-list">
                {habits.map(habit => {
                    const doneToday = habit.completions.some(d => {
                        const a = new Date(d);
                        const b = new Date();
                        a.setHours(0, 0, 0, 0);
                        b.setHours(0, 0, 0, 0);
                        return a.getTime() === b.getTime();
                    });

                    return (
                        <div key={habit._id} className="habit-card">
                            <div>
                                <h4 className="habit-title">{habit.title}</h4>
                                <p className="habit-sub">
                                    🔥 Total completions: {habit.completions.length}
                                </p>
                            </div>

                            <button
                                className={`habit-done-btn ${doneToday ? 'done' : 'active'}`}
                                disabled={doneToday || loadingId === habit._id}
                                onClick={() => markDone(habit._id)}
                            >
                                {doneToday ? 'Done Today' : 'Mark Done'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Habits;

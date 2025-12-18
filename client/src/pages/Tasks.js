import { useEffect, useState, useCallback } from 'react';
import api from '../api/api';

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );

    // Fetch tasks for selected date
    const fetchTasks = useCallback(async () => {
        try {
            const res = await api.get('/tasks');

            const filtered = res.data.filter(task => {
                const taskDate = new Date(task.createdAt)
                    .toISOString()
                    .split('T')[0];
                return taskDate === selectedDate;
            });

            setTasks(filtered);
        } catch (err) {
            console.error(err);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Create task
    const createTask = async () => {
        if (!title.trim()) return;

        try {
            await api.post('/tasks', {
                title,
                createdAt: selectedDate
            });

            setTitle('');
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    // Toggle task
    const toggleTask = async (id) => {
        try {
            await api.patch(`/tasks/${id}/toggle`);
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <h2>Daily Tasks</h2>

            {/* Date Filter */}
            <div className="input-group">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            {/* Add Task */}
            <div className="input-group">
                <input
                    placeholder="Add a task for this day"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && createTask()}
                />
                <button className="primary" onClick={createTask}>
                    Add
                </button>
            </div>

            {tasks.length === 0 && (
                <div className="card" style={{ textAlign: 'center', color: '#64748b' }}>
                    No tasks for this day 🎯
                </div>
            )}

            {tasks.map(task => (
                <div className="card task-card" key={task._id}>
                    <div
                        className={`task-item ${task.completed ? 'completed' : ''}`}
                        onClick={() => toggleTask(task._id)}
                    >
                        {task.title}
                    </div>

                    <span className={`status ${task.completed ? 'done' : 'pending'}`}>
                        {task.completed ? 'Completed' : 'Pending'}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default Tasks;

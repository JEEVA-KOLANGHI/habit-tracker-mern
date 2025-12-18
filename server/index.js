require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => res.send('API running'));

// Only authentication routes for now
app.use('/api/auth', require('./routes/auth'));

// Do NOT include tasks/habits until you create those files
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/habits', require('./routes/habits'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));

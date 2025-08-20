// server.js
const express = require('express');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/taskRoutes');
const app = express();

app.use(bodyParser.json());

// routes
app.use('/api/tasks', taskRoutes);

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

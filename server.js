const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const expensesRouter = require('./routes/expenses');
const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/expenses', expensesRouter);

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

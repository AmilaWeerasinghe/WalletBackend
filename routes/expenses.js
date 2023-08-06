// Import necessary modules
const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');

// Middleware function to get a single expense by ID
async function getExpense(req, res, next) {
    try {
      const expense = await Expense.findById(req.params.id);
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
      res.expense = expense;
      next();
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

// GET summary data for the dashboard
router.get('/summary', async (req, res) => {
    console.log("summary")
    try {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
        const summaryData = await Expense.aggregate([
          {
            $match: {
              date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
            },
          },
          {
            $group: {
              _id: '$category',
              totalAmount: { $sum: '$amount' },
            },
          },
          {
            $project: {
              category: '$_id',
              totalAmount: 1,
              _id: 0,
            },
          },
        ]);
        console.log("summaryData",summaryData)
    
        res.json(summaryData);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
  });

// GET all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single expense by ID
router.get('/:id', getExpense, (req, res) => {
  res.json(res.expense);
});

// CREATE a new expense
router.post('/', async (req, res) => {
  const expense = new Expense({
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    category: req.body.category,
    amount: req.body.amount,
  });

  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE an existing expense
router.patch('/:id', getExpense, async (req, res) => {
  if (req.body.title) {
    res.expense.title = req.body.title;
  }
  if (req.body.description) {
    res.expense.description = req.body.description;
  }
  if (req.body.date) {
    res.expense.date = req.body.date;
  }
  if (req.body.category) {
    res.expense.category = req.body.category;
  }
  if (req.body.amount) {
    res.expense.amount = req.body.amount;
  }

  try {
    const updatedExpense = await res.expense.save();
    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an expense
router.delete('/:id', getExpense, async (req, res) => {
  try {
    await res.expense.remove();
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;

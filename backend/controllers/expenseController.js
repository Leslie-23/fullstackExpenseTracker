const Expense = require("../models/Expense");

exports.createExpense = async (req, res) => {
  const { userId, dateBought, itemBought, amount, note } = req.body;

  try {
    const newExpense = new Expense({
      userId,
      dateBought,
      itemBought,
      amount,
      note,
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  const { userId } = req.params;

  try {
    const expenses = await Expense.find({ userId });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  const { expenseId } = req.params;
  const { dateBought, itemBought, amount, note } = req.body;

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      {
        dateBought,
        itemBought,
        amount,
        note,
      },
      { new: true }
    );

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  const { expenseId } = req.params;

  try {
    await Expense.findByIdAndDelete(expenseId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

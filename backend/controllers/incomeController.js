const Income = require("../models/Income");

exports.createIncome = async (req, res) => {
  const { userId, dateReceived, amountReceived, note } = req.body;

  try {
    const newIncome = new Income({
      userId,
      dateReceived,
      amountReceived,
      note,
    });

    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getIncomes = async (req, res) => {
  const { userId } = req.params;

  try {
    const incomes = await Income.find({ userId });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateIncome = async (req, res) => {
  const { incomeId } = req.params;
  const { dateReceived, amountReceived, note } = req.body;

  try {
    const updatedIncome = await Income.findByIdAndUpdate(
      incomeId,
      {
        dateReceived,
        amountReceived,
        note,
      },
      { new: true }
    );

    res.status(200).json(updatedIncome);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteIncome = async (req, res) => {
  const { incomeId } = req.params;

  try {
    await Income.findByIdAndDelete(incomeId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

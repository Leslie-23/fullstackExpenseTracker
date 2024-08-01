const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  dateReceived: {
    type: Date,
    required: true,
  },
  amountReceived: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
  },
});

module.exports = mongoose.model("Income", incomeSchema);

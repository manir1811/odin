const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const Schema = mongoose.Schema;

// Create Schema
const TransactionSchema = new Schema({
  desc: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  account: {
    type: String,
    required: true
  },
  currency: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  excludefromreport: {
    type: Boolean,
    default: false
  }
});

TransactionSchema.plugin(timestamps);
module.exports = Transaction = mongoose.model(
  "transactions",
  TransactionSchema
);

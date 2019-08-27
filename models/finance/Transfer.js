const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const Schema = mongoose.Schema;

// Create Schema
const TransferSchema = new Schema({
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  fromCurrency: {
    type: String,
    required: false
  },
  ToCurrency: {
    type: String,
    required: false
  },
  fromAmount: {
    type: Number,
    required: true
  },
  toAmount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

TransferSchema.plugin(timestamps);
module.exports = Transfer = mongoose.model("transfers", TransferSchema);

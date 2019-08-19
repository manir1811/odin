const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create Schema
const AccountSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  balance: {
    type: String,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Account = mongoose.model("accounts", AccountSchema);
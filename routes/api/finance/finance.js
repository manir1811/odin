const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Accounts Model
const Account = require("../../../models/finance/Account");
// Transaction Model
const Transaction = require("../../../models/finance/Transaction");

// Validation
const accountValidate = require("../../../validation/finance/account");
const transactionValidate = require("../../../validation/finance/transaction");

// @route:  GET     /api/finance/test
// @desc:   Tests finance route
// @access: Public
router.get("/test", (req, res) => {
  res.json({ mgs: "Hello" });
});

// @route:  POST     /api/finance/accounts
// @desc:   Create a new account
// @access: Private
router.post("/accounts", (req, res) => {
  const { errors, isValid } = accountValidate(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const newAccount = new Account({
    name: req.body.name,
    type: req.body.type,
    currency: req.body.currency,
    balance: req.body.balance
  });

  newAccount.save().then(account => res.json(account));
});

// @route:  GET     /api/finance/accounts
// @desc:   Get all accounts
// @access: Private
router.get("/accounts", (req, res) => {
  Account.find()
    .then(accounts => res.json(accounts))
    .catch(err => res.status(404).json("No Accounts found"));
});

// @route:  GET     /api/finance/accounts/:id
// @desc:   Get specific account by ID
// @access: Private
router.get("/accounts/:id", (req, res) => {
  Account.findById(req.params.id)
    .then(account => res.json(account))
    .catch(err => res.status(404).json("No Account found by this ID"));
});

// @route:  POST     /api/finance/transactions
// @desc:   Create a new transaction
// @access: Private
router.post("/transactions", (req, res) => {
  const { errors, isValid } = transactionValidate(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newTransaction = new Transaction({
    desc: req.body.desc,
    type: req.body.type,
    amount: req.body.amount,
    category: req.body.category,
    account: req.body.account,
    date: req.body.date
  });

  Account.findById(req.body.account)
    .then(account => {
      if (req.body.type == "credit") {
        account.balance += parseInt(req.body.amount);
      } else {
        account.balance -= parseInt(req.body.amount);
      }
      newTransaction.currency = account.currency;
      account.save();
      newTransaction.save().then(transaction => res.json(transaction));
    })
    .catch(err =>
      res.status(404).json({ accountnotfound: "Account not found" })
    );
});

// @route:  GET     /api/finance/transactions
// @desc:   Get all transactions
// @access: Private
router.get("/transactions", (req, res) => {
  Transaction.find()
    .then(transactions => res.json(transactions))
    .catch(err => res.status(404).json("No transactions found"));
});

// @route:  GET     /api/finance/transactions/:id
// @desc:   Get specific transaction by ID
// @access: Private
router.get("/transactions/:id", (req, res) => {
  Transaction.findById(req.params.id)
    .then(transaction => res.json(transaction))
    .catch(err => res.status(404).json("No transaction found by this ID"));
});

// @route:  DELETE   /api/finance/transactions/:id
// @desc:   Get specific transaction by ID
// @access: Private
router.delete("/transactions/:id", (req, res) => {
  Transaction.findById(req.params.id)
    .then(transaction => {
      console.log(transaction.account);
      Account.findById(transaction.account)
        .then(account => {
          if (transaction.type == "credit") {
            account.balance -= transaction.amount;
          } else {
            account.balance += transaction.amount;
          }
          account.save();
          transaction
            .remove()
            .then(() => res.json({ success: true }))
            .catch(err => "Could not delete transaction");
        })
        .catch(err =>
          res.status(404).json({ accountnotfound: "Account not found" })
        );
    })
    .catch(err => res.status(404).json("No transaction found by this ID"));
});

// TODO: Transfer

module.exports = router;

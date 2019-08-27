const express = require("express");
const router = express.Router();

// Transaction Model
const Transaction = require("../../../models/finance/Transaction");

// Validation
const transactionValidate = require("../../../validation/finance/transaction");

// @route:  GET     /api/finance/test
// @desc:   Tests finance route
// @access: Public
router.get("/test", (req, res) => {
  res.json({ mgs: "Hello" });
});

// @route:  POST     /api/finance/transactions
// @desc:   Create a new transaction
// @access: Private
router.post("/", (req, res) => {
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
router.get("/", (req, res) => {
  Transaction.find()
    .then(transactions => res.json(transactions))
    .catch(err => res.status(404).json("No transactions found"));
});

// @route:  GET     /api/finance/transactions/:id
// @desc:   Get specific transaction by ID
// @access: Private
router.get("/:id", (req, res) => {
  Transaction.findById(req.params.id)
    .then(transaction => res.json(transaction))
    .catch(err => res.status(404).json("No transaction found by this ID"));
});

// @route:  DELETE   /api/finance/transactions/:id
// @desc:   Get specific transaction by ID
// @access: Private
router.delete("/:id", (req, res) => {
  Transaction.findById(req.params.id)
    .then(transaction => {
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

module.exports = router;

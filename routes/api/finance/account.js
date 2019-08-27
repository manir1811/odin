const express = require("express");
const router = express.Router();

// Accounts Model
const Account = require("../../../models/finance/Account");

// Validation
const accountValidate = require("../../../validation/finance/account");

// @route:  POST     /api/finance/accounts
// @desc:   Create a new account
// @access: Private
router.post("/", (req, res) => {
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
router.get("/", (req, res) => {
  Account.find()
    .then(accounts => res.json(accounts))
    .catch(err => res.status(404).json("No Accounts found"));
});

// @route:  GET     /api/finance/accounts/:id
// @desc:   Get specific account by ID
// @access: Private
router.get("/:id", (req, res) => {
  Account.findById(req.params.id)
    .then(account => res.json(account))
    .catch(err => res.status(404).json("No Account found by this ID"));
});

module.exports = router;

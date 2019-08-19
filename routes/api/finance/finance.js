const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Accounts Model
const Account = require("../../../models/finance/Account");

// Validation
const accountValidation = require("../../../validation/finance/account");

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
  const { errors, isValid } = accountValidation(req.body);
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

module.exports = router;

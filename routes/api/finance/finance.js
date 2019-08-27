const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Import sub modules
const account = require("./account");
const transaction = require("./transaction");
const transfer = require("./transfer");

router.use("/accounts", account);
router.use("/transactions", transaction);
router.use("/transfers", transfer);

module.exports = router;

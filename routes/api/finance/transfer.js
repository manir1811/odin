const express = require("express");
const router = express.Router();

// Load Model
const Transfer = require("../../../models/finance/Transfer");

// validation
const transferValidate = require("../../../validation/finance/transfer");

// @route:  GET     /api/finance/transfers
// @desc:   Finds all transfer records
// @access: Private
router.get("/", (req, res) => {
  Transfer.find()
    .then(foundTransfer => res.json(foundTransfer))
    .catch(err =>
      res.status(400).json({ transfernotfound: "No transfers found" })
    );
});

// @route:  POST     /api/finance/transfers
// @desc:   Create a new transfer
// @access: Private
router.post("/", (req, res) => {
  const { errors, isValid } = transferValidate(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newTransfer = new Transfer({
    from: req.body.from,
    to: req.body.to,
    fromAmount: req.body.fromAmount,
    toAmount: req.body.toAmount,
    date: req.body.date
  });

  Account.findById(req.body.from)
    .then(from => {
      Account.findById(req.body.to)
        .then(to => {
          from.balance -= newTransfer.fromAmount;
          to.balance += newTransfer.toAmount;
          from.save();
          to.save();
          newTransfer
            .save()
            .then(savedTransfer =>
              res.json({ from: from, to: to, newTransfer: savedTransfer })
            );
        })
        .catch(err =>
          res.status(404).json({
            accountnotfound: "Something happened in finding toAccount"
          })
        );
    })
    .catch(err =>
      res
        .status(404)
        .json({ accountnotfound: "Something happened in finding fromAccount" })
    );
});

// @route:  DELETE     /api/finance/transfers/:id
// @desc:   Deletes transfer by ID
// @access: Private
router.delete("/:id", (req, res) => {
  Transfer.findById(req.params.id)
    .then(foundTransfer => {
      Account.findById(foundTransfer.to)
        .then(foundTo => {
          Account.findById(foundTransfer.from)
            .then(foundFrom => {
              foundFrom.balance += foundTransfer.fromAmount;
              foundTo.balance -= foundTransfer.toAmount;
              foundFrom.save();
              foundTo.save();
              foundTransfer.remove().then(
                res.json({
                  from: foundFrom,
                  to: foundTo,
                  transferDeleted: "success"
                })
              );
            })
            .catch(err =>
              res
                .status(404)
                .json({ accountnotfound: "From Account not found" })
            );
        })
        .catch(err =>
          res.status(404).json({ accountnotfound: "To Account not found" })
        );
      //   res.json(foundTransfer);
    })
    .catch(err =>
      res.status(404).json({ transfernotfound: "Transfer not found" })
    );

  // Account.findById(req.body.from)
  //   .then(from => {
  //     Account.findById(req.body.to)
  //       .then(to => {
  //         from.balance -= newTransfer.fromAmount;
  //         to.balance += newTransfer.toAmount;
  //         from.save();
  //         to.save();
  //         newTransfer
  //           .save()
  //           .then(savedTransfer =>
  //             res.json({ from: from, to: to, newTransfer: savedTransfer })
  //           );
  //       })
  //       .catch(err =>
  //         res.status(404).json({
  //           accountnotfound: "Something happened in finding toAccount"
  //         })
  //       );
  //   })
  //   .catch(err =>
  //     res
  //       .status(404)
  //       .json({ accountnotfound: "Something happened in finding fromAccount" })
  //   );
});

module.exports = router;

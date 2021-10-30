const express = require("express");
const Product = require("../models/product");
const Comment = require("../models/comments");
const auth = require("../middleware/auth");
const router = new express.Router();
const mongoose = require("mongoose");

router.post("/comments/:id", auth, async (req, res) => {
  let p_id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(p_id)) {
    return res.status(400).send({ message: "Invalid Product id", data: {} });
  }
  Product.findOne({ _id: p_id })
    .then((product) => {
      if (!product) {
        return res.status(200).send({
          message: "No Product Found",
          data: {},
        });
      } else {
        const comment = new Comment({
            commentText: req.body.commentText,
            product:req.params.id,
            owner: req.user._id,
          });
          try {
             comment.save();
            return res.status(200).send({
                message: "Comment Successfully Added",
                data: {},
              });
          } catch (e) {
            res.status(400).send(e);
          }
        
      }
    })
    .catch((err) => {
      return res.status(200).send({
        message: err.message,
        data: {},
      });
    });
});

module.exports = router;

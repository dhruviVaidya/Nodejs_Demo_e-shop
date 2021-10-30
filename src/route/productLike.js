const express = require("express");

const Product = require("../models/product");
const ProductLike = require("../models/productLike");
const auth = require("../middleware/auth");
const router = new express.Router();
const mongoose = require("mongoose");

router.post("/pro/like/:id", auth, async (req, res) => {
  // const user = await User.findById(req.body.LikedBy);
  // if (!user) return res.status(400).send("Invalid user");

  let p_id = req.params.id;
  console.log(p_id);

  if (!mongoose.Types.ObjectId.isValid(p_id)) {
    return res.status(400).send({ message: "Invalid Product id", data: {} });
  }

  Product.findOne({ _id: p_id })
    .then((product) => {
      if (!product) {
        return res.status(400).send({ message: "No Product Found", data: {} });
      } else {
        let current_user = req.user;
        ProductLike.findOne({
          product_id: p_id,
          owner: current_user._id,
        }).then(async (p_like) => {
           
          if (!p_like) {
            let likeDoc = new ProductLike({
              product_id: p_id,
              owner: current_user._id
            });
            let LIKEPRODUCT = await likeDoc.save();
            console.log(LIKEPRODUCT);
            await Product.updateOne(
              {
                _id: p_id,
              },
              {
                $push: { isLiked: LIKEPRODUCT._id },
              }
            );
            res.json({ message: "You Have Liked the Product" });
          } else {
            console.log(p_like._id);
            await ProductLike.deleteOne({
                        _id: p_like._id,
                      });
                      console.log(p_like.product_id)
                      await Product.updateOne(
                        {
                          _id:p_like.product_id,
                        },
                        {
                          $pull: { isLiked: p_like._id },
                        }
                      );
                      res.json({ message: "You Have UnLiked the Product" });
          }
        });
        if (!product) {
                return res.status(500);
              }
      }
    })
    .catch((err) => {
      return res.status(400).send({ message: err.message, data: {} });
    });
  //   const product = await LikeProduct.findOne({
  //     product_id: p_id,
  //     LikedBy: u_id,
  //   }).then(async (p_like) => {
  //     if (!p_like) {
  //       let likeDoc = new LikeProduct({
  //         product_id: p_id,
  //         LikedBy: u_id,
  //       });
  //       let LIKEPRODUCT = await likeDoc.save();
  //       console.log(LIKEPRODUCT);
  //       await Product.updateOne(
  //         {
  //           _id: p_id,
  //         },
  //         {
  //           $push: { isLiked: LIKEPRODUCT._id },
  //         }
  //       );
  //       res.json({ message: "You Have Liked the Product" });
  //     } else {
  //       await LikeProduct.deleteOne({
  //         _id: p_like._id,
  //       });
  //       console.log(p_like._id);
  //       await Product.updateOne(
  //         {
  //           _id: p_id,
  //         },
  //         {
  //           $pull: { isLiked: p_like._id },
  //         }
  //       );
  //       res.json({ message: "You Have UnLiked the Product" });
  //     }
  //   });

  //   if (!product) {
  //     return res.status(500);
  //   }
});
module.exports = router;

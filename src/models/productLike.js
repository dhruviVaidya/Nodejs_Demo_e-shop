const mongoose = require("mongoose");

const LikeSchema = mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const ProductLike = mongoose.model("ProductLike", LikeSchema);

module.exports = ProductLike;

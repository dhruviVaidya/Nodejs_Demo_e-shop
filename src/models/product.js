const mongoose = require("mongoose");
const validator = require('validator')

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
},
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
    min : 0
    
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  isLiked: [
    { type: mongoose.Schema.Types.ObjectId, ref: "LikeProduct", required: true },
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema)

module.exports = Product

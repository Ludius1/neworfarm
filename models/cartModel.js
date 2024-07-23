const mongoose = require('mongoose');
const addToCartSchema = require('../models/addToCart');

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  prdCategoryId:{
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "ProductCategory"
},
prdSectionId:{
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "ProductSection"
},

  prdDetailsId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductDetails",
    required: true,
},
  items: [addToCartSchema]
}, {
  timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
 
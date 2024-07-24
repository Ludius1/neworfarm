const mongoose = require('mongoose');
const addToCartSchema = require('../models/addToCart');

const cartSchema = new mongoose.Schema({
 product:{
    productId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, 
    default: 1
  }
},
//   prdCategoryId:{
//     type: mongoose.Types.ObjectId,
//     required: false,
//     ref: "ProductCategory"
// },
user: {
  type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
// prdSectionId:{
//     type: mongoose.Types.ObjectId,
//     required: false,
//     ref: "ProductSection"
// },

//   prdDetailsId:{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "ProductDetails",
//     required: true,
// },
  // items: [addToCartSchema]
}, {
  timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
 
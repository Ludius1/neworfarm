const mongoose = require('mongoose');

const addToCartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true  
  },
  quantity: {
    type: Number,   
    required: true,
    min: 1
  }
});

module.exports = addToCartSchema;
 
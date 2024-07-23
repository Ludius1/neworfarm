const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productCategorySchema = new Schema({
    product__category: {
        type: String,
        enum: [
            'Uncategorized', 
            'Vegetables', 
            'Fresh Fruits', 
            'Fresh Drink', 
            'Fresh Bakery', 
            'Biscuits Snacks', 
            'Fresh Meat', 
            'Fresh Milk'
        ],
        default: 'Uncategorized',
    },
    prodSubCartigory: {
        type: String
    },

});


const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);
 
module.exports = ProductCategory;

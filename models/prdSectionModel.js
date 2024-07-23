const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSectionSchema = new Schema({
    product__section: {
        type: String,
        enum: [
            'Weekly Food Offers', 
            'New Arrivals', 
            'Features', 
            'Best Rate', 
            'Top Trending Products'
        ],
        default: 'Weekly Food Offers',
    }
})
    
 
const ProductSection = mongoose.model('ProductSection', productSectionSchema);
 
module.exports = ProductSection;
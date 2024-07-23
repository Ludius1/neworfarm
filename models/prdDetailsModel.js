const {Schema, model, default: mongoose} = require('mongoose')

const ProductDetailsSchema = new Schema({
    src: {
        type: [String],
        // validate: [arrayLimit, '{PATH} exceeds the limit of 3'],
    },
    productImgLeft: {
        type: String,
        
    },
    productPoster: {
        type: String,
        // required: true,
        default: 'https://res.cloudinary.com/dy38te40o/image/upload/v1721471967/product-video1_crfizf.jpg',
    }
});

function arrayLimit(val) {
    return val.length <= 3;
}

const ProductDetails = mongoose.model('ProductDetails', ProductDetailsSchema);

module.exports = ProductDetails

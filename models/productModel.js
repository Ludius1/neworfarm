const {Schema, model, default: mongoose} = require('mongoose')

const productSchema = new Schema({
    product__name: {
        type: String,
        // required: true,
    },
    productRating: {
        type: Number,
        // required: true,
    },
    ratings: {
        type: Number,
        // required: true,
    },
    price: {
        type: Number,
        // required: true,
    },
    old__price: {
        type: Number,
        // required: true,
    },
    shop: {
        type: Number,
        // required: true,
    },
    NumberLeft: {
        type: Number,
        // required: true,
    },
    type: {
        type: String,
        // required: true,
    },
    badge: {
        type: String,
        // required: true,
    },
    desc: {
        type: Number
    },
    mfg: {
        type: String,
        // required: true,
    },
    life__span: {
        type: Number,
        // required: true,
    },
    brandName: {
        type: String,
        default: 'Orfarm',
    },
    featurePro: {
        type: String,
    },
    mainProductDesc: {
        type: String,
        // required: true,
    },
    productElementDetails: {
        type: String,
        // required: true,
    },
    productDetailsNEW: {
        type: String,
    //     required: true,
    },
    productYoutubeLink: {
        type: String,
        default: 'https://www.youtube.com/embed/rLrV5Tel7zw?si=KZFCDrbrWhwoWByS',
    },
    productSupremeQualityDetails: {
        type: String,
        // required: true,
    },
    prdDetailsId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "ProductDetails"
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
    
   
   
   
}, { timestamps: true });

// function arrayLimit(val) {
//     return val.length <= 3;
// }

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

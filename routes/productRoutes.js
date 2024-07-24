const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createProducts,
  uploadProductFile,
  getAProduct, getCart,
  getProducts, getNewArrivalProducts,  getProductCartigory,   
  uploadMultipleImages,   getWeeklyProducts, addCart ,
  editProduct,  
  deleteProduct, getTopTrendingProducts, 
} = require('./../controllers/productController');
const upload = require('../middleware/multer');

const productsRoutes = express.Router();  
  
productsRoutes.post('/', createProducts);
productsRoutes.post('/upload-multiple-product-images', upload.array('src'), uploadMultipleImages);
productsRoutes.post('/upload-product-images-desc', upload.single('productImgLeft'), uploadProductFile); 
productsRoutes.get('/', getProducts);
productsRoutes.get('/cart', getCart);
productsRoutes.get('/weekly-products', getWeeklyProducts);
productsRoutes.get('/new-arrival-products', getNewArrivalProducts);
productsRoutes.get('/top-trending-products',  getTopTrendingProducts);
productsRoutes.patch('/:id', editProduct);
productsRoutes.post('/cart/add', protect, addCart );
productsRoutes.delete('/:id', deleteProduct); 
productsRoutes.get('/categories/:product__category', getProductCartigory);  
productsRoutes.get('/:id', getAProduct);
 



module.exports = productsRoutes;
 
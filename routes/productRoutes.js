const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createProducts,
  uploadProductFile,
  getAProduct, getCart,deleteProductFromCart,
  getProducts, getNewArrivalProducts,  getProductCartigory,  
  uploadMultipleImages,  getWeeklyProducts, addCart ,
  editProduct,  postnotificationnContent,
  deleteProduct,searchProducts, getTopTrendingProducts, 
} = require('./../controllers/productController');
const upload = require('../middleware/multer');
 
const productsRoutes = express.Router();   
  
productsRoutes.post('/', createProducts);
productsRoutes.post('/upload-multiple-product-images', upload.array('src'), uploadMultipleImages);
productsRoutes.post('/upload-product-images-desc', upload.single('productImgLeft'), uploadProductFile); 
productsRoutes.get('/', getProducts);
productsRoutes.get('/cart' , protect, getCart);
// productsRoutes.get('/notification' , notificationnContent);
productsRoutes.post('/notification' , postnotificationnContent);
productsRoutes.get('/search' , searchProducts);
productsRoutes.get('/weekly-products', getWeeklyProducts);
productsRoutes.get('/new-arrival-products', getNewArrivalProducts);
productsRoutes.get('/top-trending-products',  getTopTrendingProducts);
productsRoutes.patch('/:productId', editProduct);
productsRoutes.post('/cart/add', protect, addCart );
productsRoutes.delete('/cart/:productId', protect, deleteProductFromCart); 
productsRoutes.delete('/:productId',  deleteProduct); 
productsRoutes.get('/categories/:product__category', getProductCartigory);  
productsRoutes.get('/:id', getAProduct);
 



module.exports = productsRoutes;
 
const Product = require('../models/productModel');
const Users = require('../models/userModel');
// const Notification =   require('../models/Notification');
const Cart = require('../models/cartModel');
const AddProductToCart = require('../models/addToCart');
const ProductDetails = require('../models/prdDetailsModel');
const ProductCategory = require('../models/prdCategoryModel');
const ProductSection = require('../models/prdSectionModel');
const cloudinary = require("../utils/cloudinary");
const { v4: uuidv4 } = require('uuid');
const upload = require('../middleware/multer');


// Create a Product
const createProducts = async (req, res) => {
    
        const {
            product__name,
            productRating,
            price,
            old__price,
            shop,
            desc,
            badge,
            NumberLeft,
            type,
            mfg,
            brandName,
            featurePro,
            availability,
            life__span,
            mainProductDesc,
            productElementDetails, 
            productDetailsNEW,
            product__category,
            product__section,
            prodSubCartigory,
            src,
            productImgLeft,
            productPoster,
            productYoutubeLink,
            productSupremeQualityDetails,
        } = req.body;

        let  prdSect;
switch (product__section) {
  case "Weekly Food Offers":
    prdSect = "669e311fec684bc472f079b0" 
    break;
    case "New Arrivals":
      prdSect = "669d047458d29d7163e496ab"
      break;  
 
  default: "669e311fec684bc472f079b0"
    break;
}  
// console.log(prdSect)
        try {
          const newCategory = await ProductCategory.create({
            product__category, prodSubCartigory
          })
          if(newCategory){
          console.log(newCategory)
            const newPrdDetails = await ProductDetails.create({
              src, productPoster, productImgLeft, 
            })
            // const newPrdSection = await ProductSection.create({product__section
            // })
            if(newPrdDetails){
              console.log("line 68" , newPrdDetails)
              const newProduct = await Product.create({...req.body, prdDetailsId: newPrdDetails._id, prdCategoryId: newCategory._id, prdSectionId: prdSect });
              if (newProduct) {
  
                res.status(201).json({
                  msg: "Product created successfully",
                  data: newProduct,
                });
              }
            }else{
              res.status(400).json("unable to upload product details")
            }
             
          }
          else{
            res.status(500).json("An error occured while storing product category")
          }


        }catch(error) {
            return res.status(500).json({ error: error.msg });
        }
        
};
 

const uploadMultipleImages = async(req, res, next) => {
    // console.log("line 107",  req.files)
    const imgLinks = [];
    await uploadMultiple(imgLinks, req, res)
    
    async function uploadMultiple(imgLinks, req, res) {
        for (let i = 0; i < req.files.length; i++) {
          await cloudinary.uploader.upload(req.files[i].path, (err, result) => {
            if (err) { 
              console.log(err);
              return res.status(400).json({ msg: "Error! Couldn't upload file" });
            }
            if (result) {
              let imageUrl = result.url;
              imgLinks.push(imageUrl);
            } 
          });
          if (i === req.files.length - 1) {
            return res.status(200).json({
              msg: "Image uploaded successfully!",
              data: imgLinks,
            });
          }
        }
      }
} 



const uploadProductFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'Please select an image'});
    }
    try {
      console.log("Received file:", req.file);
  
      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }
  
      await cloudinary.uploader.upload(req.file.path, (err, result) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        if (result) {
          console.log("Upload result:", result);
          res.json({
            msg: "Image uploaded successfully",
            data: result,
          });
        }
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ msg: "An error occurred during the upload process" });
    }
  };
  

 
 
//Get  Products
const getProducts = async (req, res, next) => {
   try {
        const products = await Product.find().sort({updateAt: -1}).populate("prdDetailsId").populate("prdCategoryId").populate("prdSectionId")
        res.status(200).json(products)
   }catch (error) {
    console.log(error.message)
    return res.status(500).json({message:'Can not fetch all products', error: error.message})
   }
}    

// const notificationnContent = async (req, res, next) => {
//     try {
//       const notification = await Notification.findOne();
//       res.json(notification);
//     }catch(error){
//       console.log(error.message)
//       return res.status(500).json({message:'Can not fetch all notification', error: error.message})
//     }
// }
const postnotificationnContent = async (req, res, next) => {
  const { content } = req.body;
  let notification = await Notification.findOne();
  if (!notification) {
    notification = new Notification({ content });
  } else {
    notification.content = content;
  }
  await notification.save();
  res.json(notification);
}
 
const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
      // Check if the product exists
      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ msg: "Product not found" });
      }

      // Delete associated product details if necessary
      if (product.prdDetailsId) {
          await ProductDetails.findByIdAndDelete(product.prdDetailsId);
      }

      // Delete associated product category if necessary
      if (product.prdCategoryId) {
          await ProductCategory.findByIdAndDelete(product.prdCategoryId);
      }

      // Optionally, delete associated product section if necessary
      // You might need to adjust this if your design requires deleting sections
      // if (product.prdSectionId) {
      //     await ProductSection.findByIdAndDelete(product.prdSectionId);
      // }

      // Finally, delete the product
      await Product.findByIdAndDelete(productId);

      res.status(200).json({ msg: "Product deleted successfully" });

  } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: error.message });
  }
};


const deleteProductFromCart = async (req, res) => {
  const userId = req.user;
  const { productId } = req.params;

  try {
    // Find and delete the specific product from the user's cart
    const deletedCartItem = await Cart.findOneAndDelete({
      user: userId,
      'product.productId': productId
    });
    console.log('new', deletedCartItem) 

    if (!deletedCartItem) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error deleting product from cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

 

const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;     

    if (!query) {
      return res.status(400).json({ msg: 'Search query is required' });
    }

    // Search for products that match the query
    const products = await Product.find({
      $or: [
        { product__name: { $regex: query, $options: 'i' } }, // Case-insensitive match
        { description: { $regex: query, $options: 'i' } }
      ]
    }).sort({ updatedAt: -1 }).populate('prdDetailsId').populate('prdCategoryId').populate('prdSectionId');

    res.status(200).json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
}; 



 
//Get a Product category
// Get: api/products/categories
//UNPROTECTED
const getProductCartigory = async (req, res, next) => {
  try {
    const { product__category } = req.params;
    console.log(`Fetching products for category: ${product__category}`); 

    const category = await ProductCategory.findOne({ product__category });
    if (!category) {
        return res.status(404).json({ error: 'Category not found' });
    }

    const products = await Product.find({ prdCategoryId: category._id })
        .populate('prdDetailsId')   
        .populate('prdCategoryId')
        .populate('prdSectionId')
        .sort({ createdAt: -1 });

    console.log(`Products found: ${products.length}`); // Debugging log
    res.status(200).json(products);
} catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
}
}



//Get a New Arrival Products
//UNPROTECTED
const getNewArrivalProducts = async (req, res, next) => {
  try {
  
    // const weeklySection = await ProductSection.findOne({ product__section: 'Weekly Food Offers' });

    // if (!weeklySection) {
    //   return res.status(404).json({ message: 'Weekly Food Offers section not found' });
    // }

    const arrivalProducts = await Product.find({ prdSectionId: "669d047458d29d7163e496ab" })
      .populate('prdDetailsId')
      .populate('prdCategoryId')
      .populate('prdSectionId')
      .sort({ createdAt: -1 }); 

    return res.status(200).json(arrivalProducts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}



//Get a weekly Product
// Get: api/products/categories
//UNPROTECTED
const getTopTrendingProducts = async (req, res, next) => {
  try {
    // Find the ID for the "Weekly Food Offers" section
    const TopTrendingSection = await ProductSection.find({ product__section: 'Top Trending products' });

    if (!TopTrendingSection) {
        return res.status(404).json({ message: 'Top trending products section not found' });
    }

    // Query products with the found section ID
    const TopTrendingProducts = await Product.find({ prdSectionId: TopTrendingSection._id }).populate('prdDetailsId')   
    .populate('prdCategoryId')
    .populate('prdSectionId')
    .sort({ createdAt: -1 });

    return res.status(200).json(TopTrendingProducts);
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
}
};

//Get a weekly Product
// Get: api/products/categories 
//UNPROTECTED
const    getWeeklyProducts = async (req, res, next) => {
  try {
  
    // const weeklySection = await ProductSection.findOne({ product__section: 'Weekly Food Offers' });

    // if (!weeklySection) {
    //   return res.status(404).json({ message: 'Weekly Food Offers section not found' });
    // }

    const weeklyProducts = await Product.find({ prdSectionId: "669e311fec684bc472f079b0" })
      .populate('prdDetailsId')
      .populate('prdCategoryId')
      .populate('prdSectionId')
      .sort({ createdAt: -1 });

    return res.status(200).json(weeklyProducts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

//Edit a product
// Get: api/products/edit-product
//UNPROTECTED
const editProduct = async (req, res) => {
  const { productId } = req.params;
  const {
      product__name,
      productRating,
      price,
      old__price,
      shop,
      desc,
      badge,
      NumberLeft,
      type,
      mfg,
      brandName,
      featurePro,
      availability,
      life__span,
      mainProductDesc,
      productElementDetails, 
      productDetailsNEW,
      product__category,
      prodSubCartigory,
      product__section,
      src,
      productImgLeft,
      productPoster,
      productYoutubeLink,
      productSupremeQualityDetails,
  } = req.body;

  try {
      // Check if the product exists
      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ msg: "Product not found" });
      }

      console.log("Original Product:", product);

      // Prepare update data
      const updateData = {
          product__name,
          productRating,
          price,
          old__price,
          shop,
          desc,
          badge,
          NumberLeft,
          type,
          mfg,
          brandName,
          featurePro,
          availability,
          life__span,
          mainProductDesc,
          productElementDetails, 
          productDetailsNEW,
          product__category,
          prodSubCartigory,
          product__section,
          src,
          productImgLeft,
          productPoster,
          productYoutubeLink,
          productSupremeQualityDetails,
      };

      console.log("Update Data:", updateData);

      // Update product details
      const updatedProduct = await Product.findByIdAndUpdate(
          productId,
          updateData,
          { new: true, runValidators: true } // Return the updated document and validate before saving
      );

      console.log("Updated Product:", updatedProduct);

      // Check if update was successful
      if (!updatedProduct) {
          return res.status(400).json({ msg: "Failed to update product" });
      }

      // Send the updated product as a response
      res.status(200).json({
          msg: "Product updated successfully",
          data: updatedProduct
      });

  } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: error.message });
  }
};


 

//Get a Product
const getAProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId)
        .populate('prdDetailsId')
        .populate('prdCategoryId').populate('prdSectionId');

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
} catch (error) {
    return res.status(500).json({ error: error.message });
}  
}     
 
 
 

const getCart = async (req, res) => {
  const userId = req.user
  try {
    // Fetch cart and populate product details
    const cart = await Cart.find({user: userId}).populate({
      path: 'product.productId',
      populate: {
        path: 'prdDetailsId',
        model: 'ProductDetails' // assuming 'ProductDetails' is your model for product details
      }
    })

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error' });
  }       

}


  


const addCart = async (req, res) => {
  try {
    const { quantity, productId } = req.body;
    const user = req.user;
    console.log("productId: ",productId)

    // Check if the product already exists in the cart
    const existingProduct = await Cart.find({ user, 'product.productId': productId });
    console.log(existingProduct)
    if (existingProduct.length>=1) {
      // Product already exists in the cart

      const updateQuantity = await Cart.findOneAndUpdate({'product.productId':productId}, { 'product.quantity': quantity}, {new:true})
      console.log("updatecart: ", updateQuantity)
      if(!updateQuantity)  {
        res.status(500).json({ msg: 'Erorr updating quantity', success: false });
      }
      res.status(200).json({ msg: 'Product quantity Updated sucessfully', success: true, data: updateQuantity });
    } else {
      // Add new product to cart
      const newItem = await Cart.create({
        'product.productId': productId,
        user,
        quantity: quantity || 1
      });
      console.log('newitem', newItem)

      if (newItem) {
        res.status(201).json({ msg: 'Product added to cart successfully', success: true });
   
      } else {
        res.status(500).json({ msg: 'Failed to add product to cart', success: false });
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error', success: false });
  }
};

  


// notificationnContent, 




module.exports = {createProducts, postnotificationnContent,deleteProductFromCart, searchProducts, addCart, getTopTrendingProducts, getCart,  getNewArrivalProducts, getProductCartigory, uploadMultipleImages, uploadProductFile, getAProduct, getWeeklyProducts, getProducts, editProduct, deleteProduct}
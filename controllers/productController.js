const Product = require('../models/productModel');
const Users = require('../models/userModel');
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
    // Find the ID for the "Weekly Food Offers" section
    const NewArrivalSection = await ProductSection.find({ product__section: 'New Arrivals' });

    if (!NewArrivalSection) {
        return res.status(404).json({ message: 'New arrival product section not found' });
    }

    // Query products with the found section ID
    const newArrivalProducts = await Product.find({ prdSectionId: NewArrivalSection._id }).populate('prdDetailsId')   
    .populate('prdCategoryId')
    .populate('prdSectionId')
    .sort({ createdAt: -1 });

    return res.status(200).json(newArrivalProducts);
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
}
};


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
    const TopTrendingProducts = await Product.find({ prdSectionId: weeklySection._id }).populate('prdDetailsId')   
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
const editProduct = async (req, res, next) => {
  
  const { id: productId } = req.params;
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
    src,
    productImgLeft,
    productPoster,
    productYoutubeLink,
    productSupremeQualityDetails,
  } = req.body;

  if (!productId) {
    return res.status(400).json({ msg: 'Product ID must be provided' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Update product category if provided
    if (product__category || prodSubCartigory) {
      const updatedCategory = await ProductCategory.findByIdAndUpdate(
        product.prdCategoryId,
        { product__category, prodSubCartigory },
        { new: true }
      );
      if (!updatedCategory) {
        return res.status(500).json("An error occurred while updating product category");
      }
    }

    // Update product details if provided
    if (src || productImgLeft || productPoster) {
      const updatedDetails = await ProductDetails.findByIdAndUpdate(
        product.prdDetailsId,
        { src, productPoster, productImgLeft },
        { new: true }
      );
      if (!updatedDetails) {
        return res.status(500).json("An error occurred while updating product details");
      }
    }

    // Update the main product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
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
        productSupremeQualityDetails,
        productYoutubeLink
      },
      { new: true }
    );

    if (updatedProduct) {
      res.status(200).json({
        msg: "Product updated successfully",
        data: updatedProduct,
      });
    } else {
      res.status(500).json("An error occurred while updating the product");
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
 
}


 

// //Get  all product in cart
// const getCart = async (req, res, next) => {
//   try {
//     const cartSection = await ProductSection.findOne({ product__section: 'Weekly Food Offers' });

//     if (!weeklySection) {
//         return res.status(404).json({ message: 'Weekly Food Offers section not found' });
//     }

//     // Query products with the found section ID
//     const weeklyProducts = await Product.find({ prdSectionId: weeklySection._id }).populate('prdDetailsId')   
//     .populate('prdCategoryId')
//     .populate('prdSectionId').populate('cartId')
//     .sort({ createdAt: -1 });

//     return res.status(200).json(weeklyProducts);
// } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Server error' });
// }
// };


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





const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; 
  try {
    // Find the product
    const product = await Product.findById(productId).populate('prdDetailsId prdCategoryId prdSectionId');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the cart already exists for the user
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      // If not, create a new cart
      cart = new Cart({
        userId,
        items: []
        
      });
    }

    // Check if the product is already in the cart
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());

    if (existingItemIndex > -1) {
      // Update the quantity if the product is already in the cart
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to the cart
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};




const getCart = async (req, res) => {
  try {
    // Fetch cart and populate product details
    const cart = await Cart.findOne()
        .populate('items.productId').populate('prdDetailsId').populate('prdSectionId').populate('prdCategoryId')

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
 
    res.status(200).json({ cart });
} catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error' });
}
};
 
 















const deleteProduct = async (req, res, nextv) => {
    res.json('delete products')
}



module.exports = {createProducts, addToCart , getTopTrendingProducts, getCart,  getNewArrivalProducts, getProductCartigory, uploadMultipleImages, uploadProductFile, getAProduct, getWeeklyProducts, getProducts, editProduct, deleteProduct}
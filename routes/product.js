const express = require("express");
const Product = require("../models/product");
const productRouter = express.Router();
const { auth, vendorAuth } = require("../middleware/auth");

productRouter.post("/api/add-product", auth, vendorAuth, async (req, res) => {
  try {
    const {
      productName,
      productPrice,
      quantity,
      description,
      category,
      vendorId,
      fullName,
      subCategory,
      images,
    } = req.body;
    const product = new Product({
      productName,
      productPrice,
      quantity,
      description,
      category,
      vendorId,
      fullName,
      subCategory,
      images,
    });
    console.log("Before saving product:", product);
    const savedProduct = await product.save();
    console.log("Product saved to DB:", savedProduct);

    return res.status(201).send(savedProduct);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/api/popular-products", async (req, res) => {
  try {
    const products = await Product.find({ popular: true });
    if (!products || products.length == 0) {
      return res.status(400).json({ msg: "Product not found" });
    } else {
      return res.status(200).json(products);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/api/recommended-products", async (req, res) => {
  try {
    const products = await Product.find({ recommend: true });
    if (!products || products.length == 0) {
      return res.status(400).json({ msg: "Product not found" });
    } else {
      return res.status(200).json({ products });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/api/products-by-category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category, popular: true });
    if (!products || products.length == 0) {
      return res.status(400).json({ msg: "No products found" });
    } else {
      return res.status(200).json(products);
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

//related product
productRouter.get(
  "/api/related-product-by-subcategory/:productId",
  async (req, res) => {
    try {
      const { productId } = req.params;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ msg: "No products found" });
      } else {
        const relatedProduct = await Product.find({
          subCategory: product.subCategory,
          _id: { $ne: productId },
        });
        if (!relatedProduct || relatedProduct.length == 0) {
          return res.status(404).json({ msg: "No related product found" });
        }
        return res.status(200).json(relatedProduct);
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
);

//high related product
productRouter.get("/api/top-rated-products", async (req, res) => {
  try {
    const topRatedProducts = await Product.find({})
      .sort({ averageRating: -1 })
      .limit(10);
    if (!topRatedProducts || topRatedProducts.length == 0) {
      return res.status(404).json({ msg: "No top rated products found" });
    }
    return res.status(200).json(topRatedProducts);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});


productRouter.get('/api/products-by-subcategory/:subCategory',async (req,res) => {
  try {
    const {subCategory} = req.params;
    const products =  await Product.find({subCategory:subCategory});
    if(!products || products.length == 0){
      return res.status(404).json({ msg: "No products found in this sub category" });
    }
    return res.status(200).json(products);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});


productRouter.get("/api/search-products",async (req,res) => {
  try {
    const {query} = req.query;
    if(!query){
      return res.status(400).json({msg : "Query parameter required"})
    }
    const products = await Product.find({
      $or:[
        {productName: {$regex:query, $options:'i'}},
        {description: {$regex:query, $options:'i'}},
      ]
    });
    if(!products || products.length == 0){
      return res.status(404).json({ msg: "No products found matching the query"});
    }
    return res.status(200).json(products);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});


productRouter.put('/api/edit-product/:productId', auth,vendorAuth ,async (req,res) => {
  try {
    const {productId} = req.params;
    const product = await Product.find(productId);
    if(!product){
      return res.status(404).json({msg : "Product not found"});
    }
    if(product.vendorId.toString() !== req.user.id){
      return res.status(403).json({msg : "Unauthorized to edit this product"})
    }
  } catch (e) {
    
  }
});

module.exports = productRouter;

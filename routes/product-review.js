const express = require('express');
const ProductReview = require('../models/product_review');
const Product = require('../models/product');
const ProductReviewRouter = express.Router();

ProductReviewRouter.post('/api/product-review',async (req,res) => {
    try {
        const {buyerId,email,fullName,productId,rating,review} = req.body;
        const existingReview =  await ProductReview.findOne({buyerId,productId});
        if(existingReview){
            return res.status(400).json({msg : "you have already review this product"})
        }
        const reviews = new ProductReview({buyerId,email,fullName,productId,rating,review});
        await reviews.save();
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }

        const previousTotalRating = product.totalRating || 0;
        const previousAverageRating = product.averageRating || 0;

        product.totalRating = previousTotalRating + 1;
        product.averageRating = ((previousAverageRating * previousTotalRating) + rating) / product.totalRating;

        await product.save();

        return res.status(201).send({reviews});
    } catch (e) {
        res.status(500).json({error : e.message});
    }
})


ProductReviewRouter.get('/api/product-review',async (req,res) => {
    try {
        const reviews = await ProductReview.find();
        return res.status(200).json(reviews);
    } catch (e) {
        rres.status(500).json({error : e.message});
    }
})

module.exports = ProductReviewRouter;
const express = require('express');
const ProductReview = require('../models/product_review');
const ProductReviewRouter = express.Router();

ProductReviewRouter.post('/api/product-review',async (req,res) => {
    try {
        const {buyerId,email,fullName,productId,rating,review} = req.body;
        const reviews = new ProductReview({buyerId,email,fullName,productId,rating,review});
        await reviews.save();
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
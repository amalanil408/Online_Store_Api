const express = require('express');
const SubCategory = require('../models/sub_categody');
const subCategoryRouter = express.Router();


subCategoryRouter.post('/api/subcategories',async (req,res) => {
    try {
        const {categoryId , categoryName , image , subCategoryName} = req.body;
        const subCategory = new SubCategory({categoryId , categoryName , image , subCategoryName})
        await subCategory.save();
        res.status(201).send(subCategory);
    } catch (e) {
        res.status(500).json({error : e.message});
    }
});


subCategoryRouter.get('/api/subcategories',async (req,res) => {
    try {
        const subCategories =  await SubCategory.find();
        return res.status(200).json(subCategories)
    } catch (e) {
        res.status(500).json({error : e.message});
    }z
})


subCategoryRouter.get("/api/category/:categoryName/subcategories",async (req,res) => {
    try {
        const {categoryName} = req.params;
        const subcategories = await SubCategory.find({categoryName});

        if(!subcategories || subcategories.length == 0){
            return res.status(400).json({msg : "Sub-Categories not found"})
        } else {
            return res.status(200).json(subcategories);
        }
    } catch (e) {
        res.status(500).json({error : e.message})
    }
});

module.exports = subCategoryRouter
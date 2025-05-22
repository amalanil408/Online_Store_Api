const mongoose = require('mongoose');

const subCategroyScheme = mongoose.Schema({
    categoryId : {
        type : String,
        required : true
    },

    categoryName : {
        type : String,
        required : true,
    },

    image : {
        type : String,
        required : true,
    },

    subCategoryName : {
        type : String,
        required : true,
    }
});

const subCategory = mongoose.model("SubCategory",subCategroyScheme);
module.exports = subCategory;
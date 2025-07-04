const mongoose = require('mongoose');

const productReviewSchema = ({
    buyerId : {
        type : String,
        required : true
    },

    email : {
        type : String,
        required : true,
    },

    fullName : {
        type : String,
        required : true,
    },

    productId : {
        type : String,
        required: true
    },

    rating : {
        type : Number,
        required : true
    },

    review : {
        type : String,
        required : true
    }
});



const ProductsReview = mongoose.model("ProductReviews",productReviewSchema);
module.exports = ProductsReview;
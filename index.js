const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/auth");
const bannerRouter = require("./routes/banner");
const categoryRouter = require('./routes/category');
const subCategoryRouter = require('./routes/sub_category')
const productReviewRouter = require('./routes/product-review');
const productRouter = require("./routes/product")
const vendorRouter = require("./routes/vendor");
const orderRouter = require("./routes/order");
const PORT = 3000 || process.env.PORT;
const DB = "mongodb+srv://amalanil8138:amalanil9061@cluster0.8t9f395.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const app = express();


app.use(express.json());
app.use(cors());
app.use(authRouter);
app.use(bannerRouter);
app.use(categoryRouter);
app.use(subCategoryRouter),
app.use(productRouter),
app.use(productReviewRouter),
app.use(vendorRouter),
app.use(orderRouter);

mongoose.connect(DB).then(() => {
    console.log("MongoDb connected");   
})


app.listen(PORT,"0.0.0.0", () =>{
    console.log(`Server runs at port ${PORT}`); 
})
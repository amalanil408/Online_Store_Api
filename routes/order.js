const express = require("express");
const Order = require("../models/order");
const orderRouter = express.Router();
const {auth,vendorAuth} = require('../middleware/auth');

orderRouter.post("/api/orders", auth, async (req, res) => {
  try {
    const {
      fullName,
      email,
      state,
      city,
      locality,
      productName,
      productPrice,
      quantity,
      category,
      image,
      buyerId,
      vendorId,
      productId,
    } = req.body;
    const createdAt = new Date().getMilliseconds();
    const order = new Order({
      fullName,
      email,
      state,
      city,
      locality,
      productName,
      productPrice,
      quantity,
      category,
      image,
      buyerId,
      vendorId, 
      productId,
      createdAt
    });
    await order.save();
    return res.status(201).send(order);
  } catch (e) {
    res.status(500).json({error : e.message});
  }
});

orderRouter.get('/api/orders',async (req,res) => {
  try {
      const order = await Order.find();
      return res.status(200).json(order);
  } catch (e) {
      res.status(500).json({error : e.message});
  }
})


orderRouter.get('/api/orders/:buyerId', auth, async (req,res)=> {
  try {
    const {buyerId} = req.params;
    const orders = await Order.find({buyerId});
    if(orders.length == 0){
      return res.status(404).json({msg : "No Orders"});
    } else {
      return res.status(200).json(orders);
    }
  } catch (e) {
    res.status(500).json({error : e.message});
  }
})


orderRouter.delete('/api/orders/:id',auth, async (req,res) => {
  try {
    const {id} = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if(!deletedOrder){
      res.status(404).json({msg : "Order not found"})
    } else {
      res.status(200).json({msg : "Order was deleted successfully"})
    }
  } catch (e) {
    res.status(500).json({error : e.message});
  }
})



orderRouter.get('/api/orders/vendors/:vendorId', auth,vendorAuth,async (req,res)=> {
  try {
    const {vendorId} = req.params;
    const orders = await Order.find({vendorId});
    console.log("Requested vendorId:", vendorId);
    if(orders.length == 0){
      return res.status(404).json({msg : "No Orders"});
    } else {
      return res.status(200).json(orders);
    }
  } catch (e) {
    res.status(500).json({error : e.message});
  }
})



orderRouter.patch('/api/orders/:id/delivered',async (req,res) => {
  try {
    const {id} = req.params;
    const updatedOrder =  await Order.findByIdAndUpdate(
      id,
      {delivered : true , processing : false},
      {new : true}
    );
    if(!updatedOrder){
      return res.status(400).json({msg : "order not found"})
    } else {
      return res.status(200).json(updatedOrder);
    }
  } catch (e) {
    res.status(500).json({error : e.message});
  }
});


orderRouter.patch('/api/orders/:id/processing',async (req,res) => {
  try {
    const {id} = req.params;
    const updatedOrder =  await Order.findByIdAndUpdate(
      id,
      {processing : false , delivered : false},
      {new : true}
    );
    if(!updatedOrder){
      return res.status(400).json({msg : "order not found"})
    } else {
      return res.status(200).json(updatedOrder);
    }
  } catch (e) {
    res.status(500).json({error : e.message});
  }
});

module.exports = orderRouter;

const express = require('express');
const { ObjectId } = require('mongodb');
const expressAsyncHandler = require('express-async-handler');
const tokenVerify = require('../middlewares/tokenVerify');

const wishlistApp = express.Router();

wishlistApp.use(express.json());

wishlistApp.get('/', async (req, res) => {
    try {
        const wishlistCollection = req.app.get('wishlistCollection');
        const wishlist = await wishlistCollection.find().toArray();
        res.send({ message: "Wishlist fetched successfully", data: wishlist });
    } catch (error) {
        res.status(500).send({ message: "Error fetching wishlist", error: error.message });
    }
});

wishlistApp.get('/tenant/:tenantUsername', tokenVerify, expressAsyncHandler(async (req, res) => {
    const wishlistCollection = req.app.get('wishlistCollection');
    const wishlist = await wishlistCollection.find({ tenantUsername: req.params.tenantUsername }).toArray();
    res.send({ message: "Wishlist fetched successfully", data: wishlist });
}));

wishlistApp.post('/add', tokenVerify, async (req, res) => {
    try {
        const wishlistCollection = req.app.get('wishlistCollection');
        const newWishlistItem = req.body;
        await wishlistCollection.insertOne(newWishlistItem);
        res.send({ message: "House added to wishlist successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error adding to wishlist", error: error.message });
    }
});

wishlistApp.patch('/:houseId', tokenVerify, expressAsyncHandler(async (req, res) => {
    const wishlistCollection = req.app.get('wishlistCollection');
    let houseId = req.params.houseId;
    let updateFields = req.body;

    const result = await wishlistCollection.updateOne(
        { _id: houseId },
        { $set: { ...updateFields } }
    );

    res.send({ message: "Wishlist item updated successfully" });
}));

wishlistApp.delete('/:houseId', tokenVerify, expressAsyncHandler(async (req, res) => {
    const wishlistCollection = req.app.get('wishlistCollection');
    let houseId = req.params.houseId;

    const result = await wishlistCollection.deleteOne({ _id: houseId });

    res.send({ message: "Wishlist item removed successfully" });
}));

module.exports = wishlistApp;

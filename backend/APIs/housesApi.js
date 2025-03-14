const express = require('express');
const { ObjectId } = require('mongodb');
const expressAsyncHandler = require('express-async-handler');
const tokenVerify = require('../middlewares/tokenVerify');

const housesApp = express.Router();

housesApp.use(express.json());

housesApp.get('/', async (req, res) => {
    try {
        const housesCollection = req.app.get('housesCollection');
        const houses = await housesCollection.find().toArray();
        res.send({ message: "Houses fetched successfully", data: houses });
    } catch (error) {
        res.status(500).send({ message: "Error fetching houses", error: error.message });
    }
});

housesApp.get('/owner/:ownerUsername', tokenVerify, expressAsyncHandler(async (req, res) => {
    const housesCollection = req.app.get('housesCollection');
    const houses = await housesCollection.find({ ownerUsername: req.params.ownerUsername }).toArray();
    res.send({ message: "Houses fetched successfully", data: houses });
}));

housesApp.get('/:houseId', tokenVerify, expressAsyncHandler(async (req, res) => {
    const housesCollection = req.app.get('housesCollection');
    let house = await housesCollection.findOne({ _id: new ObjectId(req.params.houseId) });
    if (house) {
        res.send({ message: "House fetched successfully", data: house });
    } else {
        res.status(404).send({ message: "House not found" });
    }
}));

housesApp.post('/add', tokenVerify, async (req, res) => {
    try {
        const housesCollection = req.app.get('housesCollection');
        const newHouse = req.body;
        await housesCollection.insertOne(newHouse);
        res.send({ message: "House added successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error adding house", error: error.message });
    }
});

housesApp.put('/:houseId', tokenVerify, expressAsyncHandler(async (req, res) => {
    const housesCollection = req.app.get('housesCollection');
    let houseId = new ObjectId(req.params.houseId);
    let updatedHouse = req.body;
    
    const result = await housesCollection.updateOne(
        { _id: houseId },
        { $set: { ...updatedHouse } }
    );

    res.send({ message: "House updated successfully" });
}));

housesApp.patch('/:houseId', tokenVerify, expressAsyncHandler(async (req, res) => {
    const housesCollection = req.app.get('housesCollection');
    let houseId = new ObjectId(req.params.houseId);
    let updateFields = req.body;

    const result = await housesCollection.updateOne(
        { _id: houseId },
        { $set: { ...updateFields } }
    );

    res.send({ message: "House details updated successfully" });
}));

housesApp.delete('/:houseId', tokenVerify, expressAsyncHandler(async (req, res) => {
    const housesCollection = req.app.get('housesCollection');
    let houseId = new ObjectId(req.params.houseId);

    const result = await housesCollection.deleteOne({ _id: houseId });

    res.send({ message: "House deleted successfully" });
}));

module.exports = housesApp;

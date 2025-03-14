const express = require('express');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const expressAsyncHandler = require('express-async-handler');
const tokenVerify = require('../middlewares/tokenverify');
require('dotenv').config();

const registrationsApp = express.Router();

registrationsApp.use(express.json());

registrationsApp.post('/login', expressAsyncHandler(async (req, res) => {
    const registrationsCollection = req.app.get('registrationsCollection');
    const userCred = req.body;

    let dbUser = await registrationsCollection.findOne({ username: userCred.username });
    if (!dbUser) {
        res.send({ message: "*Invalid username*" });
    } else {
        let result = await bcryptjs.compare(userCred.password, dbUser.password);
        if (!result) {
            res.send({ message: "*Invalid password*" });
        } else {
            let signedToken = jwt.sign({ username: userCred.username }, process.env.SECRET_KEY, { expiresIn: '7d' });
            res.send({ message: "Login success", token: signedToken, user: dbUser });
        }
    }
}));

registrationsApp.post('/registrations', expressAsyncHandler(async (req, res) => {
    const registrationsCollection = req.app.get('registrationsCollection');
    const newUser = req.body;

    let existingUser = await registrationsCollection.findOne({ username: newUser.username });
    if (existingUser) {
        res.send({ message: "Username already exists" });
    } else {
        let hashedPassword = await bcryptjs.hash(newUser.password, 7);
        newUser.password = hashedPassword;
        let hashedPassword2 = await bcryptjs.hash(newUser.confirmPassword, 7);
        newUser.confirmPassword = hashedPassword2;
        await registrationsCollection.insertOne(newUser);
        res.send({ message: "User registered successfully" });
    }
}));

registrationsApp.put('/registrations/:id', tokenVerify, expressAsyncHandler(async (req, res) => {
    const registrationsCollection = req.app.get('registrationsCollection');
    let userId = new ObjectId(req.params.id);
    let modifiedUser = req.body;

    let hashedPassword = await bcryptjs.hash(modifiedUser.password, 7);
    modifiedUser.password = hashedPassword;
    let hashedPassword2 = await bcryptjs.hash(modifiedUser.confirmPassword, 7);
    modifiedUser.confirmPassword = hashedPassword2;

    const result = await registrationsCollection.updateOne(
        { _id: userId },
        { $set: { ...modifiedUser } }  
    );
    res.send({ message: "Registration updated successfully" });
}));

module.exports = registrationsApp;

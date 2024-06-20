require("dotenv").config();
const express = require("express");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const port = process.env.PORT;
const app = express();
const cors = require("cors");
app.use(express.json());
const { registerUser, loginUser, getUsers, updateUser, deleteUser } = require('./endpoints');



app.use(
    cors({  
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204
    })
);



mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running port:${port}`);
            console.log('MongoDB Connected')
        })
    })
    .catch(err => console.error(err));


    

const auth = (req, res, next) => {
    const auth = req.headers["authorization"];
    if (!auth) return res.status(401).json({ msg: 'No token, authorization denied' });
    let jwtoken;
    if (auth !== undefined) {
        jwtoken = auth.split(" ")[1];
    }
    try {
        const decoded = jwt.verify(jwtoken, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};


app.post('/register', registerUser);
app.post('/login', loginUser);
app.get('/', auth, getUsers);
app.put('/user/:id', auth, updateUser);
app.delete('/user/:id', auth, deleteUser);

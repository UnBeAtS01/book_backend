const express = require('express');
const User = require('../models/User.js');
const async_error_handler = require('express-async-handler');
const generateToken = require('../utils/generateToken.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const userRoute = express.Router();
//register users
userRoute.post('/register', async_error_handler(async (req, res, next) => {
    const { name, email, password } = req.body;
    const userexists = await User.findOne({ email });
    if (userexists) {
        throw new Error('User Exist');
    }
    const userCreated = await User.create({ email, name, password });
    res.json({
        _id: userCreated._id,
        name: userCreated.name,
        password: userCreated.password,
        email: userCreated.email,
        token: generateToken(userCreated._id),
    });
}));

//login 
userRoute.post('/login', async_error_handler(async (req, res, next) => {
    //
    const { email, password } = req.body;
    const dbuser = await User.findOne({ email });

    if (!dbuser || !  await dbuser.isPasswordMatch(password)) {
        res.status(401);
        throw new Error('Invalid Input');
    }
    res.status(200);
    res.json({
        _id: dbuser._id,
        name: dbuser.name,
        password: dbuser.password,
        email: dbuser.email,
        token: generateToken(dbuser._id),
    });


}))
//fetch users
userRoute.get('/', authMiddleware, (req, res) => {
    console.log(req.headers);
    res.send(req.user);
});
//delete users
userRoute.delete('/:id', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        console.log(user);
        res.send(user);
    }
    catch (err) {
        console.log(err);
        res.send(err.message);
    }
});
//update users
userRoute.put('/:id', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        console.log(user);
        res.send(user);
    }
    catch (err) {
        console.log(err);
        res.send(err.message);
    }
});


//profile route
userRoute.get('/profile', authMiddleware, async_error_handler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('books');
        if (!user) throw new Error("You don't have any profile");
        res.status(200);
        res.send(user);
    }
    catch (error) {
        res.status(500);
        throw new Error("sever error");
    }
}))
module.exports = userRoute;
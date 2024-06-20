// src/controllers/userController.js
const User = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        const { name, email, password } = req.body;

        let user = await User.find({ email });
        if (user.length !== 0) {
            return res.status(400).json({ msg: 'User already exists' });
        } else if (name == undefined) {        
            response.status(400);
            response.send("Invalid name");
        } else if (!email.match(pattern) || !email.endsWith("@gmail.com")) {        
            response.status(400);
            response.send("Invalid email address");
        } else if (password.length < 8) {
            response.status(400);
            response.send("Password is too short");
        }
        else {
            user = new User({
                name,
                email,
                password: await bcrypt.hash(password, 10)
            });    
            await user.save();
            res.status(201).json({ msg: 'User registered successfully' });
        }

    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        const { email, password } = req.body;
        if (!email.match(pattern) || !email.endsWith("@gmail.com")) {        
            res.status(400);
            res.send("Invalid email address");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User Not Found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Wrong Password' });
        }
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (users.length == 0) return res.status(204).json({msg:"No Users"});
        else return res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userFields = {};
        if (name) userFields.name = name;
        if (email) userFields.email = email;
        if (password) userFields.password = await bcrypt.hash(password, 10);
        if (req.params.id.length !== 24) {
            res.status(400).json({msg: "Invalid id"});
        }
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        user = await User.findByIdAndUpdate(req.params.id, { $set: userFields }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        if (req.params.id.length !== 24) {
            res.status(400).json({msg: "Invalid id"});
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User deleted' });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

const bcrypt = require('bcryptjs'); // userService

const { validationResult } = require('express-validator');
const userService = require('../service/user-service');
const jwt = require('jsonwebtoken');//tokenService

const User = require('../models/User');

const { secret } = require('../config');


const generateAccessToken = (id) => {
    const payload = {
        id
    }
    return jwt.sign(payload, secret, { expiresIn: "24h" });
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Error validation", errors });
            }
            const { userName, password, email, dataRegistration, status} = req.body;
            const userData = await userService.registration(userName, password, email, dataRegistration, status);
            
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 100, httpOnly: true });

            return res.json(userData);
        } catch (e) {
            console.log(e);
            res.status(400).json({ massage: 'Registration error' });
        }
    }

    async login(req, res) {
        try {
            const { userName, password } = req.body;
            const user = await User.findOne({ userName });
            if (!user) {
                return res.status(400).json({ massage: `User ${userName} not found` });
            };
            const isValidPassword = bcrypt.compareSync(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ massage: "Incorrect password entered" });
            };
            const token = generateAccessToken(user._id);
            return res.json({ token, userName, userId: user._id });
        } catch (e) {
            res.status(400).json({massage: 'Login error'})
        }        
    }

    async activate(req, res) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            console.log(e);
        }
    }

    async refresh(req, res) {

    }

    async getUsers(req, res) {
        const id = req.user.id;
        const user = await User.findOne({ _id: id });
        if (user && user.status) {
            try {
                const users = await User.find();
                return res.json(users);
             } catch (e) {                
            } 
        } else {
            res.status(403).json({massage: 'User not authorization'})
        }
                             
    }

    async deleteUser(req, res){
        try {
            const { usersName } = req.body;
            await User.deleteMany({ userName: { $in: usersName } });
            return res.json({ massage: "User delete" });
        } catch (e) {
            res.status(400).json({massage: 'Error delete'})
        }
    }

    async updateUser(req, res){
        try {
            const { usersName, status } = req.body;
            await User.updateMany(
                { userName: { $in: usersName } },
                { $set: { status } }
              );
            return res.json({ massage: "User update" });
        } catch (e) {
            res.status(400).json({massage: 'Error update'})
        }
    }
}

module.exports = new authController();
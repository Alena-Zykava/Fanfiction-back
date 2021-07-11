const bcrypt = require('bcryptjs'); // userService

const { validationResult } = require('express-validator');
const userService = require('../service/user-service');
const jwt = require('jsonwebtoken');//tokenService

const User = require('../models/User');

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
            res.status(400).json({message: e.message})
        }
    }

    async login(req, res) {
        try {
            const { userName, password } = req.body;

            const userData = await userService.login(userName, password );
            
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 100, httpOnly: true });

            return res.json(userData);

        } catch (e) {
            console.log(e);
            res.status(403).json({message: e.message})
        }        
    }

    async logout(req, res) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            console.log(e)
            res.status(400).json({message: e.message})
        }
    }

    async activate(req, res) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(`${process.env.CLIENT_URL}/login`);
        } catch (e) {
            console.log(e);
            res.status(400).json({message: e.message})
        }
    }

    async refresh(req, res) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 100, httpOnly: true });

            return res.json(userData);
        } catch (e) {
            console.log(e);
            res.status(400).json({message: e.message})
        }
    }

    async getUsers(req, res) {        
        const id = req.user.id;        
        const user = await User.findOne({ _id: id });
        const isAdmin = user.roles.indexOf('ADMIN') !== -1;
        
        if (user && isAdmin) {
            try {
                const users = await User.find();
                return res.json(users);
             } catch (e) {                
            } 
        } else {
            res.status(403).json({message: 'User is not ADMIN!'})
        }
                             
    }

    async deleteUser(req, res){
        try {
            const { usersName } = req.body;
            await User.deleteMany({ userName: { $in: usersName } });
            return res.json({ message: "User delete" });
        } catch (e) {
            res.status(400).json({message: 'Error delete'})
        }
    }

    async updateUserStatus(req, res){
        try {
            const { usersName, status } = req.body;
            await User.updateMany(
                { userName: { $in: usersName } },
                { $set: { status } }
              );
            return res.json({ message: "User update" });
        } catch (e) {
            res.status(400).json({message: 'Error update'})
        }
    }

    async updateUserRoles(req, res){
        try {
            const { usersName, roles } = req.body;
            await User.updateMany(
                { userName: { $in: usersName } },
                { $set: { roles } }
              );
            return res.json({ message: "User update" });
        } catch (e) {
            res.status(400).json({message: 'Error update'})
        }
    }
}

module.exports = new authController();
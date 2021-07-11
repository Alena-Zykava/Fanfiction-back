const bcrypt = require('bcryptjs');
const uuid = require('uuid'); 

const UserModel = require('../models/User');
const Role = require('../models/Role');
const mailService = require('../service/mail-service');
const tokenService = require('../service/token-service');
const UserDto = require('../dtos/user-dto');

class UserService {
    async registration(userName, password, email, dataRegistration, status) {
        const candidate = await UserModel.findOne({ userName });
        if (candidate) {
            throw new Error('A user with the same name already exists');  
        }
        const hashPassword = bcrypt.hashSync(password, 5);
        
        const userRole = await Role.findOne({ value: "USER" }); 

        const activationLink = uuid.v4();
                    
        const user = new UserModel({ userName,  email, dataRegistration, status, activationLink, password: hashPassword, roles: [userRole.value] });
        await user.save();
        await mailService.sendActivationMail(email, `${process.env.API_URL}/auth/activate/${activationLink}`); 

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        
        return { ...tokens, user: userDto };
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink });        
        if (!user) {
            throw new Error('Bad link');
        }
        user.isVerification = true;
        await user.save();
    }

    async login(userName, password) {
        const user = await UserModel.findOne({ userName });
        if (!user) {
            throw new Error(`User ${userName} not found`);            
        };
        if (!user.isVerification) {
            throw new Error(`User ${userName} did not confirm email`);            
        }
        if (!user.status) {
            throw new Error(`User ${userName} is blok!`);            
        }
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            throw new Error("Incorrect password entered");      
        };
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        
        return { ...tokens, user: userDto };
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new Error('Not login');
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findOne(refreshToken);
        if (!userData || !tokenFromDb) {
            throw new Error('Not login');
        }

        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        
        return { ...tokens, user: userDto };
    }

}

module.exports = new UserService();
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
            return res.status(400).json({massage: 'A user with the same name already exists'})
        }
        const hashPassword = bcrypt.hashSync(password, 5);
        
        const userRole = await Role.findOne({ value: "USER" }); //why??

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

}

module.exports = new UserService();
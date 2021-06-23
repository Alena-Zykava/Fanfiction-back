module.exports = class UserDto {
    email;
    userName;
    id;
    isVerification;
    
    constructor(model) {
        this.email = model.email;
        this.userName = model.userName;
        this.id = model._id;
        this.isVerification = model.isVerification;
    }
}
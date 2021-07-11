module.exports = class UserDto {
    email;
    userName;
    id;
    isVerification;
    roles;
    
    constructor(model) {
        this.email = model.email;
        this.userName = model.userName;
        this.id = model._id;
        this.isVerification = model.isVerification;
        this.roles = model.roles
    }
}
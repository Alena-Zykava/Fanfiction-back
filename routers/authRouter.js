const Router = require('express');
const router = new Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/registration', [
    check('userName').notEmpty(),
    check('password').isLength({ min: 1 }),
    check('email').isEmail()
], authController.registration);
router.post('/login', authController.login);
router.post('/logout', authController.logout);


router.get('/activate/:link', authController.activate);
router.get('/refresh', authController.refresh);


router.post('/delete', authController.deleteUser);
router.post('/update_status', authController.updateUserStatus);
router.post('/update_roles', authController.updateUserRoles);


router.get('/users', authMiddleware, authController.getUsers);

module.exports = router;

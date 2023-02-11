const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const {User, Cart} = require('../models/models');
const jwt = require('jsonwebtoken');

const generateJWT = (id, email, role) => {
    return jwt.sign(
        {
            id,
            email,
            role
        },
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )


}

class UserController {
    async register(req, resp, next) {
        const {email, password, role} = req.body;

        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный e-mail или пароль'));
        }

        const candidate = await User.findOne({where: {email}});
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким e-mail уже существует'));
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({email, password: hashPassword, role});
        const cart = await Cart.create({userId: user.id});
        const token = generateJWT(user.id, user.email, user.role);

        return resp.json({token})

    } 

    async login(req, resp, next) {
        const {email, password} = req.body;
        const candidate = await User.findOne({where: {email}});
        
        if (!candidate) {
            return next(ApiError.internalError('Пользователь не найден'))
        }

        let comparePassword = bcrypt.compareSync(password, candidate.password);
        if (!comparePassword) {
            return next(ApiError.internalError('Неверный пароль'))
        }

        const token = generateJWT(candidate.id, candidate.email, candidate.role);
        return resp.json({token})
    } 

    async checkAuth(req, resp, next) {

        const token = generateJWT(req.user.id, req.user.email, req.user.role);
        return resp.json({token})
    } 
}

module.exports = new UserController();
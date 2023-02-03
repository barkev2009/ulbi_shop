const ApiError = require('../error/ApiError');

class UserController {
    async register(req, resp) {

    } 

    async login(req, resp) {
        
    } 

    async checkAuth(req, resp, next) {
        const {id} = req.query;

        if (!id) {
            return next(ApiError.badRequest('No ID given'))
        }

        return resp.json(id)
    } 
}

module.exports = new UserController();
const {Image} = require('../models/models');
const ApiError = require('../error/ApiError')

class ImageController {
    async create(req, resp) {
        const {path} = req.body;
        const image = await Image.create({path});

        return resp.json(image);
    } 

    async getAll(req, resp) {
        const images = await Image.findAll();
        return resp.json(images);
    } 
}

module.exports = new ImageController();
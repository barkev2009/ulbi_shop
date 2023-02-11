const uuid = require('uuid');
const path = require('path');
const {Device, Image, DeviceInfo} = require('../models/models');
const ApiError = require('../error/ApiError');

class DeviceController {
    async create(req, resp, next) {
        try {
            const {name, price, brandId, typeId, info} = req.body;
            const {img} = req.files;
            let filename = uuid.v4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', filename));

            const device = await Device.create({name, price, brandId, typeId, info});

            if (info) {
                info = JSON.parse(info);
                info.forEach(
                    item => DeviceInfo.create(
                        {
                            title: item.title,
                            description: item.description,
                            deviceId: device.id
                        }
                    )
                )
            }

            
            const image = await Image.create({path: filename, deviceId: device.id});

            return resp.json({device, image})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    } 

    async getAll(req, resp) {
        let {brandId, typeId, limit, page} = req.query;

        page = page || 1;
        limit = limit || 5;

        let offset = limit * (page - 1);
        let devices;

        if (!brandId && !typeId) {
            devices = await Device.findAll({limit, offset});
        }
        if (brandId && !typeId) {
            devices = await Device.findAll({where: {brandId}, limit, offset});
        }
        if (!brandId && typeId) {
            devices = await Device.findAll({where: {typeId}, limit, offset});
        }
        if (brandId && typeId) {
            devices = await Device.findAll({where: {typeId, brandId}, limit, offset});
        }

        return resp.json(devices);
    } 

    async getOne(req, resp) {
        const {id} = req.params;
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}, {model: Image, as: 'image'}]
            }
        )

        return resp.json(device)
    } 
}

module.exports = new DeviceController();
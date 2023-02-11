const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const { model } = require('../db');

const User = sequelize.define(
    'user',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        email: { type: DataTypes.STRING, unique: true },
        password: { type: DataTypes.STRING },
        role: { type: DataTypes.STRING, defaultValue: 'USER' }
    }
)

const Cart = sequelize.define(
    'cart',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
    }
)

const CartDevice = sequelize.define(
    'cart_device',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
    }
)

const Image = sequelize.define(
    'img',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        path: { type: DataTypes.STRING, allowNull: false, unique: true }
    }
)

const Device = sequelize.define(
    'device',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, unique: true, allowNull: false },
        price: { type: DataTypes.INTEGER, allowNull: false },
        rating: { type: DataTypes.INTEGER, defaultValue: 0 }
    }
)

const Type = sequelize.define(
    'type',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: true }
    }
)

const Brand = sequelize.define(
    'brand',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: true }
    }
)

const Rating = sequelize.define(
    'rating',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        value: { type: DataTypes.INTEGER, allowNull: false }
    }
)

const DeviceInfo = sequelize.define(
    'device_info',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false }
    }
)

const TypeBrand = sequelize.define(
    'type_brand',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
    }
)

User.hasOne(Cart);
Cart.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

Cart.hasMany(Device);
Device.belongsTo(Cart);

Type.hasMany(Device);
Device.belongsTo(Type);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Device.hasMany(Rating);
Rating.belongsTo(Device);

Device.hasMany(CartDevice);
CartDevice.belongsTo(Device);

Device.hasMany(DeviceInfo, {as: 'info'});
DeviceInfo.belongsTo(Device);

Type.belongsToMany(Brand, {through: TypeBrand});
Brand.belongsToMany(Type, {through: TypeBrand} );

Device.hasOne(Image, {as: 'image', foreignKey: 'deviceId'});
Image.belongsTo(Device, {foreignKey: 'deviceId'});

module.exports = {
    User, Cart, CartDevice, Device, Type, Brand, Rating, TypeBrand, DeviceInfo, Image
};
require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express()
app.use(cors());
app.use(express.json());

app.get(
    '/',
    (req, resp) => {
        resp.status(200).json(
            {
                message: 'Hey, fuckers!!!'
            }
        );
    }
)

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (err) {
        console.error(err)
    }
}

start();
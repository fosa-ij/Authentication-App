const Mongoose = require('mongoose')
require('dotenv').config()

const RemoteDB = process.env.DB_STRING
const connectDB = async () => {
    Mongoose.connect(RemoteDB)
        .then(client => {
            console.log("MongoDB Connected");
        })
        .catch(err => {
            console.error(err);
        })
}
module.exports = connectDB
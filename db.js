const Mongoose = require('mongoose')
const RemoteDB = 'mongodb+srv://fosaij-Auth-App:RlQA0DJAqLUCxkC8@cluster0.kn2cqta.mongodb.net/?retryWrites=true&w=majority'
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
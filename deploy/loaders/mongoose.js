const mongoose = require('mongoose');

module.exports = async (dbURI) => {
    const connection = await mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return connection.connection.db;
}
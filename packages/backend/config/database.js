
const mongoose = require('mongoose');

const db  = ()=> {

    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB bağlantısı başarılı!'))
        .catch(err => console.error('MongoDB bağlantı hatası:', err));
}
module.exports = db;

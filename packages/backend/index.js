const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db =require('./config/database.js');
const Auth = require('./routes/auth.js');
const Trip = require('./routes/trip.js');
const socketIo = require('./config/socket.js');



const app = express();
dotenv.config();
db();

app.use(cors());
app.use(express.json({limit: '30mb',extended : true}));
app.use(express.urlencoded({limit: '30mb',extended : true}));


const socketio = socketIo(app);



app.use("/api",Auth);
app.use("/api",Trip);

app.get('/api', (req, res) => {
    res.json({message: "api isteği"});
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})



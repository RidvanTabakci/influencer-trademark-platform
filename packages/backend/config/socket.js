const http = require('http');
const {Server} = require('socket.io');



const socketIo = (app) => {
    const server = http.createServer(app);
    const io = new Server(server,{
        cors : {
            origin: 'http://localhost:5000',
            methods : ['GET', 'POST'],
        }
    });
}
module.exports = socketIo;

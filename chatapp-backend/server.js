const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const _ = require('lodash');
//const logger = require('morgan');

const app = express();

app.use(cors());



const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const {User} = require('./Helpers/userClass');

require('./socket/streams')(io, User);
require('./socket/private')(io);


const secretConfig = require('./config/secret');
//??? 没懂
const auth = require('./routes/authRoutes');
const posts = require('./routes/postRoutes');
const users = require('./routes/userRoutes');
const friends = require('./routes/friendsRoutes');
const message = require('./routes/messageRoutes');
const image = require('./routes/imageRoutes');
/* app.use((req, res, next)  => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'DELETE', 'PUT', 'OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
}); // no need, because these work has been done by 'app.use(cors())' */ 

app.use(express.json({limit: '50mb' }));
app.use(express.urlencoded({extended: true, limit: '50mb' }));
app.use(cookieParser());
//app.use(logger('dev'));

mongoose.Promise = global.Promise;
mongoose.connect(secretConfig.dburl, { useNewUrlParser: true });


app.use('/api/chatapp', auth);
app.use('/api/chatapp', posts);
app.use('/api/chatapp', users);
app.use('/api/chatapp', friends);
app.use('/api/chatapp', message);
app.use('/api/chatapp', image);


app.listen(3000, () => {
    console.log('Running on port 3000');
});
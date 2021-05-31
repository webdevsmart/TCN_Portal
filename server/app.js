const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const path = require('path');
require('dotenv').config();

const userRoute = require('./routes/usersRoute.js');
const authRoute = require('./routes/authRoute.js');
const settingsRoute = require('./routes/settingsRoute.js');
const dashboardRoute = require('./routes/dashboardRoute.js');
const stockRoute = require('./routes/stockRoute.js');
const machineRoute = require('./routes/machineRoute.js');

const Cron = require('./controller/cronCtrl.js');

const config = require('./config.js');

const MONGODB_URI = config.mongodburi || 'mongodb://localhost:27017/vend-portal';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (error) => {
    console.log(error);
});

let app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client/build')));

app.use((req, res, next) => {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
     if (req.method === 'OPTIONS') {
         res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
         return res.status(200).json({});
     }
     next();
});

global.appRoot = path.resolve(__dirname);

// routing
app.use('/api/users', userRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/auth', authRoute);
app.use('/api/settings', settingsRoute);
app.use('/api/stock', stockRoute);
app.use('/api/machine', machineRoute);
// end routing

// setting the uploads folder. 
app.use('/uploads', express.static('uploads')); 

// for production mode
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '/client/build/index.html'));
// });
// end for production mode

// setting for cron jobs for getting log.txt data
Cron.setCron();
// end setting for cron jobs

app.listen(PORT, () => {
    console.log('Server started on port', PORT);
});


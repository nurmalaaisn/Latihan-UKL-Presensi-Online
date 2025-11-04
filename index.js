/** load library express */
const express = require('express');

/** create object that instances of express */
const app = express();

/** define port of server */
const PORT = 8000;

/** load library cors */
const cors = require('cors');
app.use(cors());

/** parsing JSON body */
app.use(express.json());

/** define all routes */
const authRoute = require('./routes/auth'); // login route
const userRoute = require('./routes/user'); // user CRUD route
const attendanceRoute = require('./routes/attendance');

/** define prefix for each route */
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute); 
app.use('/api/attendance', attendanceRoute);

/** run server based on defined port */
app.listen(PORT, () => {
    console.log(`Server runs on port ${PORT}`);
});

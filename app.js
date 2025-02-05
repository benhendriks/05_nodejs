const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

// Stting up the config file variables
dotenv.config({path: './config/config.env'});

//connecting to database
connectDatabase();

// Set up the body parser
app.use(express.json());

// create middleware
/*
  const middleware = (req, res, next) => {
      console.log('Hello from the middleware');
      // Setting the user variable globally
      req.requestMethod = req.url;
      next();
  };

  app.use(middleware);
*/

// Imorting the jobs routes
const jobs = require('./routes/jobs');

app.use('/api/v1', jobs);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});

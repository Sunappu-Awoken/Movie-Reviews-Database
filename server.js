// app.js

const express = require("express");
const bodyParser = require('body-parser');
require('dotenv').config();

// Load configuration
const config = require('./config');
const { checkServiceCredentials, initDatabase } = require('./utils');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize database
initDatabase();

// Routes
const indexRouter = require('./routes/index');
const reviewsRouter = require('./routes/reviews');

app.use('/', indexRouter);
app.use('/reviews', reviewsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`To view your app, open this link in your browser: http://localhost:${port}`);
});

// config.js

const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { BasicAuthenticator } = require('ibm-cloud-sdk-core');

const dbName = 'movies-reviews';

const NLU_APIKEY = process.env.NLU_APIKEY;
const NLU_URL = process.env.NLU_URL;
const CLOUDANT_URL = process.env.CLOUDANT_URL;
const CLOUDANT_USERNAME = process.env.CLOUDANT_USERNAME;
const CLOUDANT_PASSWORD = process.env.CLOUDANT_PASSWORD;

module.exports = {
  dbName,
  NLU_APIKEY,
  NLU_URL,
  CLOUDANT_URL,
  CLOUDANT_USERNAME,
  CLOUDANT_PASSWORD
};

// utils.js

const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { BasicAuthenticator } = require('ibm-cloud-sdk-core');
const uuid = require('uuid');

const {
  dbName,
  CLOUDANT_URL,
  CLOUDANT_USERNAME,
  CLOUDANT_PASSWORD,
  NLU_APIKEY,
  NLU_URL
} = require('./config');

// Initialize Cloudant database
async function initDatabase() {
  if (CLOUDANT_USERNAME && CLOUDANT_PASSWORD

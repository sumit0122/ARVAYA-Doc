const express = require('express');
const app = express();
exports.jwt = require('jsonwebtoken');
const helmet = require('helmet');
exports.dotenv = require('dotenv').config();
exports.applicationkey = process.env.APPLICATION_KEY;
const port = process.env.PORT;
const hostname = process.env.HOST_NAME;
const cors = require('cors');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));

app.use(cors());
app.use('/', function timeLog(req, res, next) {
  var deviceid = req.headers['deviceid'];
  var supportKey = req.headers['supportkey'];
  var applicationkey = req.headers['applicationkey']
  console.log("Requested Method : -", req.method, req.url, "supportkey : ", supportKey, req.headers);
  next();
});
app.use(helmet());
app.disable('x-powered-by');

app.post('/api/getSuggestion', require('./phr').getSuggestion)
app.post('/api/getProfile', require('./phr').getProfile)
app.post('/api/getService', require('./phr').getService)

app.listen(port, hostname, () => {
  console.log('ARVAYA is listening on ', hostname, port, '!');
});


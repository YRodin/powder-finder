const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
const keys = require('./config/keys');
const passport = require('passport');
const path = require('path');
const port = process.env.PORT || 5001;
// Import and execute passport.js configuration
require ('./services/passport');
// Set up Fixie proxy to be used in prod for static IP for Heroku app
const { URL } = require('url');
const Agent = require('socks5-http-client/lib/Agent');
const fixieSocksUrl = process.env.FIXIE_SOCKS_URL;
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4, // Use IPv4
};
if (process.env.NODE_ENV === 'production') {
  mongooseOptions.server = {
    socketOptions: {
      agent: new Agent({
        socksHost: new URL(fixieSocksUrl).hostname,
        socksPort: new URL(fixieSocksUrl).port,
        socksUsername: new URL(fixieSocksUrl).username,
        socksPassword: new URL(fixieSocksUrl).password,
      }),
    },
  };
}

// Connect DB
mongoose.connect(keys.MONGODB_URI, mongooseOptions);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'build')));
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });
 }
router(app);
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);
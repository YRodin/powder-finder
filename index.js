const express = require('express');
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
const keys = require('./');
const passport = require('passport');
const path = require('path');
const port = process.env.PORT || 5001;
require('dotenv').config();
// Import and execute passport.js configuration
require('./services/passport');
// Connect DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// Apply API routes
router(app);
// Serve static files
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  app.use(express.static('client/build'));
  // Catch-all route for client-side routing in React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });
} else {
  app.use(express.static(path.join(__dirname, 'build')));
}
// check current einronment, run self signed https in dev, and http in prod in order to implement googleauth20 feature
let server;
if (process.env.NODE_ENV === 'development') {
  const options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
  };
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}
server.listen(port, () => {
  console.log('Server listening on:', port);
});
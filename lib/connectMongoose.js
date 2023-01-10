'use strict';

const mongoose = require('mongoose');

mongoose.connection.on('error', function (err) {
  console.error('mongodb connection error:', err);
  process.exit(1);
});

mongoose.connection.once('open', function () {
  console.info('Connected to DB.');
});

const connectPromise = mongoose.connect('mongodb://127.0.0.1/practicanode', {
  useUnifiedTopology: true
});


module.exports = connectPromise;

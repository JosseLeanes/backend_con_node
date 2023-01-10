'use strict';

const express = require('express');
const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { isAPI } = require('./lib/utils');
require('./models'); 

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.locals.title = 'practicanode';


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', require('./routes/index'));
app.use('/anuncios', require('./routes/anuncios'));


app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));


// catch 404 and forward to error handler
app.use( (req, res, next) => next(createError(404)) );

// error handler
app.use((err, req, res, next) => { 
  if (err.array) { 
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPI(req) ?
      { message: 'not valid', errors: err.mapped()}
      : `not valid - ${errInfo.param} ${errInfo.msg}`;
  }

  err.status = err.status || 500;
  res.status(err.status);

  if (err.status && err.status >= 500) console.error(err);


  if (isAPI(req)) {
    res.json({ error: err.message });
    return;
  }

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.render('error');
});

module.exports = app;

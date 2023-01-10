'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Anuncio = mongoose.model('Anuncio');
const { buildAnuncioFilterFromReq } = require('../../lib/utils');


router.get('/', (req, res, next) => {

  const start = parseInt(req.query.start) || 0;
  const sort = req.query.sort || '_id';
  const limit = parseInt(req.query.limit) || 1000; 
  const includeTotal = req.query.includeTotal === 'true';
  const filters = buildAnuncioFilterFromReq(req);


  Anuncio.list(filters, start, limit, sort, includeTotal, function (err, anuncios) {
    if (err) return next(err);
    res.json({ result: anuncios });
  });
});


router.get('/tags', asyncHandler(async function (req, res) {
  const distinctTags = await Anuncio.distinct('tags');
  res.json({ result: distinctTags });
}));


router.post('/', [ 
  body('nombre' ).isAlphanumeric().withMessage('Must be a string'),
  body('venta'  ).isBoolean().withMessage('Must be a boolean'),
  body('precio' ).isNumeric().withMessage('Must be numeric'),
], asyncHandler(async (req, res) => {

  validationResult(req).throw();
  const anuncioData = req.body;
  const anuncio = new Anuncio(anuncioData);
  const anuncioGuardado = await anuncio.save();

  res.json({ result: anuncioGuardado });

}));

module.exports = router;

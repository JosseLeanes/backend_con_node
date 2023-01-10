'use strict';

const mongoose = require('mongoose');
const fsPromises = require('fs').promises;
const configAnuncios = require('../local_config').anuncios;
const path = require('path');

const anuncioSchema = mongoose.Schema({
  nombre: { type: String, index: true },
  venta: { type: Boolean, index: true },
  precio: { type: Number, index: true },
  foto: String,
  tags: { type: [String], index: true }
});


anuncioSchema.statics.allowedTags = function () {
  return ['work', 'lifestyle', 'motor', 'mobile'];
};


anuncioSchema.statics.cargaJson = async function (fichero) {

  const data = await fsPromises.readFile(fichero, { encoding: 'utf8' });

  if (!data) {
    throw new Error(fichero + ' Empty!!');
  }

  const anuncios = JSON.parse(data).anuncios;
  const numeroAnuncios = anuncios.length;

  for (var i = 0; i < anuncios.length; i++) {
    await (new Anuncio(anuncios[i])).save();
  }

  return numeroAnuncios;

};

anuncioSchema.statics.list = async function(filters, startRow, numRows, sortField, includeTotal, cb) {

  const query = Anuncio.find(filters);
  query.sort(sortField);
  query.limit(numRows);
  query.skip(startRow);
 

  const result = {};

  if (includeTotal) {
    result.total = await Anuncio.countDocuments();
  }
  result.rows = await query.exec();

  
  const ruta = configAnuncios.imagesURLBasePath;
  result.rows.forEach(r => r.foto = r.foto ? path.join(ruta, r.foto) : null );

  if (cb) return cb(null, result); 
  return result; 
};

var Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;

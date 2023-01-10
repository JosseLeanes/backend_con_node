'use strict';

const { askUser } = require('./lib/utils');
const { mongoose, connectMongoose, Anuncio } = require('./models');

const ANUNCIOS_JSON = './anuncios.json';

main().catch(err => console.error('Error!', err));

async function main() {
  
  await connectMongoose; 

  const answer = await askUser('Are you sure you want to delete everything and load initial data? (no) ');
  if (answer.toLowerCase() !== 'yes') {

    return process.exit(0);
  }

 
  const anunciosResult = await initAnuncios(ANUNCIOS_JSON);
  console.log(`\nAnuncios: Deleted ${anunciosResult.deletedCount}, loaded ${anunciosResult.loadedCount} from ${ANUNCIOS_JSON}`);

  
  await mongoose.connection.close();
  console.log('\nConection closed.');
}

async function initAnuncios(fichero) {
  const { deleted } = await Anuncio.deleteMany();
  const loaded = await Anuncio.cargaJson(fichero);
  return { deleted, loaded };
}

import * as dotenv from 'dotenv';
import colors from 'colors';
import { listPlaces, menu, pause, readInput } from './helpers/inquirer.js';
import Search from './models/search.js';

dotenv.config();

const main = async () => {
  let menuOption;
  const searches = new Search();
  do {
    menuOption = await menu();
    switch (menuOption) {
      case 1:
        // Mostrar mensaje
        const place = await readInput('Ciudad:');

        // Buscar los lugares
        const places = await searches.places(place);

        // Seleccionar el lugar
        const id = await listPlaces(places);
        if (id === '0') continue;
        const { name, lng, lat } = places.find((place) => place.id === id);

        // Guardar en DB
        searches.saveToHistory(name);
        // Clima
        const { desc, min, max, temp } = await searches.weather(lat, lng);

        // Mostrar resultados
        console.clear();
        console.log('\nInformacion de la ciudad\n'.cyan);
        console.log('Ciudad:', name);
        console.log('Latitud:', lat);
        console.log('Longitud:', lng);
        console.log('Temperatura:', temp);
        console.log('Mínima:', min);
        console.log('Máxima:', max);
        console.log('Clima actual:', desc.cyan);
        break;

      case 2:
        searches.capitalizedHistory.forEach((place, i) => {
          const index = `${(i + 1 + '.').cyan}`;
          console.log(`${index} ${place}`);
        });
        break;
    }
    if (menuOption !== 0) await pause();
  } while (menuOption !== 0);
};

main();

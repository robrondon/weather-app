import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import axios from 'axios';
class Search {
  history = [];
  dbPath = './db/database.json';

  constructor() {
    this.readDB();
  }

  get paramsMapbox() {
    return {
      language: 'es',
      access_token: process.env.MAPBOX_KEY,
    };
  }

  get paramsWeather() {
    return {
      units: 'metric',
      lang: 'es',
      appid: process.env.OPENWEATHER_KEY,
    };
  }

  get capitalizedHistory() {
    return this.history.map((entry) => {
      const words = entry
        .split(' ')
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
      return words;
    });
  }

  async places(city = '') {
    try {
      // Peticion http
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json`,
        params: this.paramsMapbox,
      });

      const { data } = await instance.get();

      // Retornar los lugares encontrados
      return data.features.map((place) => ({
        id: place.id,
        name: place.place_name,
        lng: place.center[0],
        lat: place.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async weather(lat, lon) {
    try {
      // Nueva instancia de axios
      const instance = axios.create({
        baseURL: 'https://api.openweathermap.org/data/2.5/weather',
        params: { ...this.paramsWeather, lat, lon },
      });

      const { data } = await instance.get();
      const { main, weather } = data;
      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error);
    }
  }

  saveToHistory(place = '') {
    // Prevenir duplicados
    if (this.history.includes(place.toLowerCase())) return;

    this.history = this.history.splice(0, 5);

    this.history.unshift(place.toLowerCase());

    // Grabar en DB
    this.saveDB();
  }

  saveDB() {
    const payload = {
      history: this.history,
    };
    writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readDB() {
    if (!existsSync(this.dbPath)) return;

    const data = JSON.parse(readFileSync(this.dbPath, { encoding: 'utf-8' }));

    this.history = data.history;
  }
}

export default Search;

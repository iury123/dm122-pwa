import HtmlService from './HtmlService.js';
import CarService from './CarService.js';

class App {

  constructor() {
    this.registerServiceWorker();
    this.start();
  }

  start() {
    const carService = new CarService();
    new HtmlService(carService);
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      const onsuccess = () => console.log('[Service Worker] Registered');
      const onfailure = () => console.log('[Service Worker] Failed');

      navigator.serviceWorker
        .register('sw.js')
        .then(onsuccess)
        .catch(onfailure);
    }
  }
}

new App();

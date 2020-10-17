import Dexie from 'https://cdn.jsdelivr.net/npm/dexie@3.0.2/dist/dexie.mjs';

let db;

export default class CarService {

    constructor() {
        this.initializeDB();
    }

    initializeDB() {
        db = new Dexie('carDB');

        db.version(1).stores({
            cars: '++id,description'
        });

        db.on('populate', async () => {
            await db.cars.bulkPut([
                { name: 'Corolla', manufacturer: 'Toyota', year: 2020, color: 'Preto' },
                { name: 'Golf', manufacturer: 'Volkswagen', year: 1995, color: 'Vermelho' },
                { name: 'Hilux', manufacturer: 'Toyota', year: 2014, color: 'Prata' },
            ]);
        });
    }

    getAll() {
        return db.cars.toArray();
    }

    get(id) {
        return db.cars.get(id);
    }

    save(car) {
        return db.cars.put(car);
    }

    delete(id) {
        return db.cars.delete(id);
    }
}

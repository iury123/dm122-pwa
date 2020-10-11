const DONE = 'done';

export default class HtmlService {

  constructor(carService) {
    this.carService = carService;
    this.bindFormEvent();
    this.listCars();
    const btnAdd = document.getElementById("add-car");
    btnAdd.addEventListener('click', () => console.log("HAHAHA"));
  }

  bindFormEvent() {
    const form = document.querySelector('form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      this.addCar(form.item.value);
      form.reset();
    })
  }

  async addCar(description) {
    const car = { description, done: false };
    const carId = await this.carService.save(car);
    car.id = carId;
    this.addToHtmlList(car);
  }

  async listCars() {
    const cars = await this.carService.getAll();
    cars.forEach(car => this.addToHtmlList(car));
  }

  async saveCar(carId, isDone) {
    const car = await this.carService.get(carId);
    car.done = isDone;
    this.carService.save(car);
  }

  toggleCar(li) {
    const carId = +li.getAttribute('data-item-id');
    li.classList.toggle(DONE);
    const isDone = li.classList.contains(DONE);
    this.saveCar(carId, isDone);
  }

  async deleteCar(li) {
    const carId = +li.getAttribute('data-item-id');
    await this.carService.delete(carId);
    li.remove();
  }

  addToHtmlList(car) {
    const ul = document.querySelector('ul');
    const li = document.createElement('li');
    // const span = document.createElement('span');
    const nameSpan = document.createElement('span');
    const manufacturerSpan = document.createElement('span');
    const colorSpan = document.createElement('span');
    const yearSpan = document.createElement('span');
    const button = document.createElement('button');

    li.setAttribute('data-item-id', car.id);
    li.addEventListener('click', () => this.toggleCar(li));


    nameSpan.textContent = `${car.name}`;
    manufacturerSpan.textContent = `${car.manufacturer}`;
    colorSpan.textContent = `${car.color}`;
    yearSpan.textContent = `${car.year}`;

    button.textContent = 'x';
    button.addEventListener('click', event => {
      event.stopPropagation();
      this.deleteCar(li);
    });

    if (car.done) {
      li.classList.add(DONE);
    }

    li.appendChild(nameSpan);
    li.appendChild(manufacturerSpan);
    li.appendChild(colorSpan);
    li.appendChild(yearSpan);
    li.appendChild(button);
    ul.appendChild(li);
  }
}

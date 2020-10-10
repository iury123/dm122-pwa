const DONE = 'done';

export default class HtmlService {

  constructor(carService) {
    this.carService = carService;
    this.bindFormEvent();
    this.listCars();
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
    const span = document.createElement('span');
    const button = document.createElement('button');

    li.setAttribute('data-item-id', car.id);
    li.addEventListener('click', () => this.toggleCar(li));

    span.textContent = car.description;

    button.textContent = 'x';
    button.addEventListener('click', event => {
      event.stopPropagation();
      this.deleteCar(li);
    });

    if (car.done) {
      li.classList.add(DONE);
    }

    li.appendChild(span);
    li.appendChild(button);
    ul.appendChild(li);
  }
}

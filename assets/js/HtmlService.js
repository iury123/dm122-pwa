
export default class HtmlService {

  get carToBeEdited() {
    return JSON.parse(localStorage.getItem('carToBeEdited'));
  }

  set carToBeEdited(car) {
    if (car) {
      localStorage.setItem('carToBeEdited', JSON.stringify(car));
    } else {
      localStorage.removeItem('carToBeEdited');
    }
  }

  constructor(carService) {
    this.carService = carService;
    this.listCars();

    const btnAdd = document.getElementById("add-car");
    btnAdd?.addEventListener('click', () => {
      this.carToBeEdited = undefined;
      document.getElementById('first-screen').style.display = 'none';
      document.getElementById('second-screen').style.display = 'block';
    });

    const backBtn = document.getElementById("back-btn");
    backBtn?.addEventListener('click', () => {
      document.getElementById('second-screen').style.display = 'none';
      document.getElementById('first-screen').style.display = 'block';
    });

    const saveBtn = document.getElementById("save-btn");
    saveBtn?.addEventListener('click', () => {
      const form = document.querySelector('form');
      const car = {
        name: form.carName.value,
        manufacturer: form.manufacturer.value,
        color: form.color.value,
        year: form.year.value
      };
      if (this.carToBeEdited) {
        car.id = this.carToBeEdited.id;
      }
      this.saveCar(car);
    });
  }

  async saveCar(car) {
    this.carService.save(car);
    document.getElementById('second-screen').style.display = 'none';
    document.getElementById('first-screen').style.display = 'block';
  }

  async listCars() {
    const cars = await this.carService.getAll();
    cars.forEach(car => this.addToHtmlList(car));
  }

  async editCar(li) {
    const carId = +li?.getAttribute('data-item-id');
    this.carToBeEdited = await this.carService.get(carId);
    document.getElementById('first-screen').style.display = 'none';
    document.getElementById('second-screen').style.display = 'block';
    const form = document.querySelector('form');
    if (form && this.carToBeEdited) {
      form.carName.value = this.carToBeEdited.name;
      form.manufacturer.value = this.carToBeEdited.manufacturer;
      form.color.value = this.carToBeEdited.color;
      form.year.value = this.carToBeEdited.year;
    }
  }

  async deleteCar(li) {
    const carId = +li?.getAttribute('data-item-id');
    await this.carService.delete(carId);
    li?.remove();
  }

  addToHtmlList(car) {
    const ul = document.querySelector('ul');
    const li = document.createElement('li');
    const nameSpan = document.createElement('span');
    const manufacturerSpan = document.createElement('span');
    const colorSpan = document.createElement('span');
    const yearSpan = document.createElement('span');
    const button = document.createElement('button');

    li?.setAttribute('data-item-id', car.id);
    li?.addEventListener('click', () => this.editCar(li));

    nameSpan.textContent = `${car.id} ${car.name}`;
    manufacturerSpan.textContent = `${car.manufacturer}`;
    colorSpan.textContent = `${car.color}`;
    yearSpan.textContent = `${car.year}`;

    button.textContent = 'x';
    button.addEventListener('click', event => {
      event.stopPropagation();
      this.deleteCar(li);
    });

    if (car.done) {
      li?.classList.add(DONE);
    }

    li?.appendChild(nameSpan);
    li?.appendChild(manufacturerSpan);
    li?.appendChild(colorSpan);
    li?.appendChild(yearSpan);
    li?.appendChild(button);
    ul?.appendChild(li);
  }
}

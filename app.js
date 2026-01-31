const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const spawnBtn = document.getElementById("spawnBtn");
const stopBtn = document.getElementById("stopBtn");

canvas.width = 800;
canvas.height = 200;

let carImg = new Image();
carImg.src = "./assets/car.png";

const cars = []

let spawnIntervalId = null;

function startSpawning() {
    if (spawnIntervalId === null) {
        spawnIntervalId = setInterval(spawnCar, 500);
    }
}

function stopSpawning() {
    clearInterval(spawnIntervalId);
    spawnIntervalId = null;
}


spawnBtn.addEventListener("click", () => {
    startSpawning();
})
stopBtn.addEventListener("click", () => {
    stopSpawning();
})

function spawnCar() {
    const car = {
        x: -40,
        y: 50,
        width: 40,
        height: 20,
        speed: 2
    };

    cars.push(car);
}
    

function update() {

    console.log("Cars in array:", cars.length);
    for (let i = cars.length - 1; i >= 0; i--) {
        const car = cars[i];

        car.x += car.speed;


        // if car is completely off the right side
        if (car.x > canvas.width) {
            cars.splice(i, 1);
        }
    }
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  cars.forEach(car => {
    ctx.drawImage(carImg, car.x, car.y, car.width, car.height);
  });
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
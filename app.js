const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const spawnBtn = document.getElementById("spawnBtn");
const stopBtn = document.getElementById("stopBtn");

canvas.width = 800;
canvas.height = 200;

let carImg = new Image();
carImg.src = "./assets/car.png";

const cars = []



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
    
let carSpawn = false;

function spawnLoop() {
    if(!carSpawn) return;

    spawnCar();
    setTimeout(spawnLoop, 500);
}

spawnBtn.addEventListener("click", () => {
    if(!carSpawn) {
        carSpawn = true;
        spawnLoop();
    }
});
stopBtn.addEventListener("click", () => {
        carSpawn = false;    
});



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
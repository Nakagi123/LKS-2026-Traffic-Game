const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const spawnBtn = document.getElementById("spawnBtn");
const stopBtn = document.getElementById("stopBtn");

canvas.width = 800;
canvas.height = 200;

const roadWidth = 800;
const roadHeight = 120;

let carImg = new Image();
carImg.src = "./assets/car.png";

const roadImg = new Image();
roadImg.src = "./assets/road.png";
const roadY = (canvas.height - roadHeight) / 2;

const cars = []

const lanes = [
    {y: 60, direction: 1 },
    {y: 120, direction: -1 },
];

function spawnCar() {
    const laneIndex = Math.floor(Math.random() * lanes.length);
    const lane = lanes[laneIndex];

    const car = {
        width: 40,
        height: 20,
        y: lane.y,
        speed: 2 * lane.direction
    };
    
    if (lane.direction === 1) {
        car.x = -car.width;
    } else {
        car.x = canvas.width;
    }

    cars.push(car)
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

        if (
            (car.speed > 0 && car.x > canvas.width) ||
            (car.speed < 0 && car.x + car.width < 0 )
        ) {
            cars.splice(i, 1);
        }
    }
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(roadImg, 0, roadY, roadWidth, roadHeight)

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
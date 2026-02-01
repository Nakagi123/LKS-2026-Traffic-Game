const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const spawnBtn = document.getElementById("spawnBtn");
const stopBtn = document.getElementById("stopBtn");
const stoppingBtn = document.getElementById("stoppingBtn");
const resumeBtn = document.getElementById("resumeBtn");

canvas.width = 800;
canvas.height = 500;

const roadWidth = 800;
const roadHeight = 500;
const roadY = (canvas.height - roadHeight) / 2;

// Track loaded images
let imagesLoaded = {
    car: false,
    sign: false,
    road: false
};

// Create images with load handlers
let carImg = new Image();
carImg.src = "./assets/car.png";
carImg.onload = function() {
    console.log("Car image loaded");
    imagesLoaded.car = true;
};
carImg.onerror = function() {
    console.error("Failed to load car image");
};

const signImg = new Image();
signImg.src = "./assets/sign.png";
signImg.onload = function() {
    console.log("Sign image loaded");
    imagesLoaded.sign = true;
};
signImg.onerror = function() {
    console.error("Failed to load sign image");
};

const roadImg = new Image();
roadImg.src = "./assets/road.png";
roadImg.onload = function() {
    console.log("Road image loaded");
    imagesLoaded.road = true;
};
roadImg.onerror = function() {
    console.error("Failed to load road image");
};

const cars = [];

const lanes = [
  // Horizontal lanes
  { type: "horizontal", y: 210, vx: 2, vy: 0 },
  { type: "horizontal", y: 260, vx: -2, vy: 0 },

  // Vertical lanes
  { type: "vertical", x: 350, vx: 0, vy: 2 },
  { type: "vertical", x: 420, vx: 0, vy: -2 }
];


function spawnCar() {
    const laneIndex = Math.floor(Math.random() * lanes.length);
    const lane = lanes[laneIndex];

    const car = {
        width: 40,
        height: 30,
        vx: lane.vx,
        vy: lane.vy,
        laneIndex
    };

    if (lane.type === "horizontal") {
        car.y = lane.y;
        car.x = lane.vx > 0 ? -car.width : canvas.width;
    } else {
        car.x = lane.x;
        car.y = lane.vy > 0 ? -car.height : canvas.height;
    }

    cars.push(car);
}


let carSpawn = false;
let carsMoving = true;

function spawnLoop() {
    if (!carSpawn) return;

    spawnCar();
    setTimeout(spawnLoop, 500);
}

spawnBtn.addEventListener("click", () => {
    if (!carSpawn) {
        carSpawn = true;
        spawnLoop();
    }
});

stopBtn.addEventListener("click", () => {
    carSpawn = false;
});

resumeBtn.addEventListener("click", () => {
    carsMoving = true;
    if (!carSpawn) {
        carSpawn = true;
        spawnLoop();
    }
});

stoppingBtn.addEventListener("click", () => {
    carsMoving = false;
    carSpawn = false;
});

function update() {
    console.log("Cars in array:", cars.length);
    for (let i = cars.length - 1; i >= 0; i--) {
        const car = cars[i];

        if (carsMoving) {
            // Lane 0 (top lane)
            if (car.laneIndex === 0) {
                // Slow down halfway for left→right
                if (car.speed > 0 && car.x > canvas.width / 2) {
                    car.speed = 1; // half speed
                }
            } else {
                if (car.speed < 0 && car.x < canvas.width / 2) {
                    car.speed = -1; // half speed
                }
            }

                car.x += car.vx;
                car.y += car.vy;
        }

            if (
                car.x > canvas.width ||
                car.x + car.width < 0 ||
                car.y > canvas.height ||
                car.y + car.height < 0
            ) {
                cars.splice(i, 1);
            }

    }
}

function drawCar(car) {
    if (!imagesLoaded.car) {
        ctx.fillStyle = "blue";
        ctx.fillRect(car.x, car.y, car.width, car.height);
        return;
    }

    ctx.save();

    // Move origin to car center
    ctx.translate(
        car.x + car.width / 2,
        car.y + car.height / 2
    );

    // Determine rotation
    if (car.vx > 0) {
        // Right → no rotation
    } 
    else if (car.vx < 0) {
        ctx.scale(-1, 1); // Left → flip horizontally
    }
    else if (car.vy > 0) {
        ctx.rotate(Math.PI / 2); // Down
    }
    else if (car.vy < 0) {
        ctx.rotate(-Math.PI / 2); // Up
    }

    // Draw car centered at origin
    ctx.drawImage(
        carImg,
        -car.width / 2,
        -car.height / 2,
        car.width,
        car.height
    );

    ctx.restore();
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw road
    if (imagesLoaded.road) {
        ctx.drawImage(roadImg, 0, roadY, roadWidth, roadHeight);
    } else {
        // Draw placeholder for road
        ctx.fillStyle = "#555";
        ctx.fillRect(0, roadY, roadWidth, roadHeight);
        // Draw road lines
        ctx.fillStyle = "white";
        for (let i = 0; i < roadWidth; i += 40) {
            ctx.fillRect(i, roadY + roadHeight / 2 - 2, 20, 4);
        }
    }

    // Draw sign
    const signWidth = 20;
    const signHeight = 60;
    if (imagesLoaded.sign) {
        // Draw the actual sign image
        ctx.drawImage(signImg, canvas.width / 2 - signWidth / 2, roadY, signWidth, signHeight);
    } else {
        // Draw placeholder for sign
        ctx.fillStyle = "red";
        ctx.fillRect(canvas.width / 2 - signWidth / 2, roadY, signWidth, signHeight);
        // Draw "S" on placeholder
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("S", canvas.width / 2, roadY + 25);
    }

    // Draw cars
    cars.forEach(drawCar);

    // Draw loading status (optional, for debugging)
    if (!imagesLoaded.car || !imagesLoaded.sign || !imagesLoaded.road) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(10, 10, 200, 60);
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.textAlign = "left";
        
        const status = [
            `Car: ${imagesLoaded.car ? '✓' : 'Loading...'}`,
            `Sign: ${imagesLoaded.sign ? '✓' : 'Loading...'}`,
            `Road: ${imagesLoaded.road ? '✓' : 'Loading...'}`
        ];
        
        status.forEach((text, i) => {
            ctx.fillText(text, 20, 30 + i * 15);
        });
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
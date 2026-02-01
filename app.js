// ==============================================
// SETUP SECTION - Getting references to HTML elements
// ==============================================

// Get reference to the canvas element from HTML
const canvas = document.getElementById("game");

// Get 2D drawing context from canvas (this is what we draw on)
const ctx = canvas.getContext("2d");

// ==============================================
// BUTTON REFERENCES - Getting references to control buttons
// ==============================================

// Button to start spawning cars
const spawnBtn = document.getElementById("spawnBtn");

// Button to stop spawning cars (but keep existing cars moving)
const stopBtn = document.getElementById("stopBtn");

// Button to stop all cars from moving
const stoppingBtn = document.getElementById("stoppingBtn");

// Button to resume car movement
const resumeBtn = document.getElementById("resumeBtn");

// ==============================================
// CANVAS SETUP - Configuring the drawing area
// ==============================================

// Set canvas dimensions (width and height in pixels)
canvas.width = 800;
canvas.height = 800;

// ==============================================
// ROAD CONFIGURATION - Defining the road area
// ==============================================

// Road dimensions
const roadWidth = 800;
const roadHeight = 800;

// Calculate road position to center it on canvas
const roadY = (canvas.height - roadHeight) / 2;
const roadX = (canvas.width - roadWidth) / 2;

// ==============================================
// IMAGE LOADING SYSTEM - Tracking loaded images
// ==============================================

// Object to track which images have loaded successfully
let imagesLoaded = {
    car: false,     // Car image loading status
    sign: false,    // Sign image loading status
    road: false     // Road image loading status
};

// ==============================================
// IMAGE CREATION - Loading game images
// ==============================================

// Create car image object
let carImg = new Image();      // Create new image object
carImg.src = "./assets/car.png"; // Set image file path

// Define what happens when car image loads successfully
carImg.onload = function() {
    console.log("Car image loaded");
    imagesLoaded.car = true;  // Update loading status
};

// Define what happens if car image fails to load
carImg.onerror = function() {
    console.error("Failed to load car image");
};

// Create sign image object
const signImg = new Image();
signImg.src = "./assets/sign.png";
signImg.onload = function() {
    console.log("Sign image loaded");
    imagesLoaded.sign = true;
};
signImg.onerror = function() {
    console.error("Failed to load sign image");
};

// Create road image object
const roadImg = new Image();
roadImg.src = "./assets/road.png";
roadImg.onload = function() {
    console.log("Road image loaded");
    imagesLoaded.road = true;
};
roadImg.onerror = function() {
    console.error("Failed to load road image");
};

// ==============================================
// CAR MANAGEMENT - Storing and tracking all cars
// ==============================================

// Array to store all active car objects
const cars = [];

// ==============================================
// SPAWNING CONFIGURATION - Defining car spawn points
// ==============================================

// Car dimensions
const carWidth = 40;

// Space between lanes (traffic lanes)
const laneOffset = carWidth * 1;

// Center of the road (and canvas)
const centerX = roadX + roadWidth / 2;
const centerY = roadY + roadHeight / 2;

// Define 4 traffic lanes (2 horizontal, 2 vertical)
const lanes = [
  // Horizontal lanes (cars move left/right)
  { type: "horizontal", y: centerY - laneOffset, vx: 2, vy: 0 },  // Top lane, moves right
  { type: "horizontal", y: centerY + laneOffset, vx: -2, vy: 0 }, // Bottom lane, moves left
  
  // Vertical lanes (cars move up/down)
  { type: "vertical", x: centerX + laneOffset, vx: 0, vy: 2 },    // Right lane, moves down
  { type: "vertical", x: centerX - laneOffset, vx: 0, vy: -2 }    // Left lane, moves up
];

// ==============================================
// CAR SPAWNING FUNCTION - Creating new cars
// ==============================================

// Function to create and add a new car to the game
function spawnCar() {
    // Pick a random lane (0-3)
    const laneIndex = Math.floor(Math.random() * lanes.length);
    const lane = lanes[laneIndex];  // Get the chosen lane's data

    // Create car object with properties
    const car = {
        width: 40,           // Car width in pixels
        height: 30,          // Car height in pixels
        vx: lane.vx,         // Velocity X (horizontal speed)
        vy: lane.vy,         // Velocity Y (vertical speed)
        laneIndex           // Which lane this car belongs to
    };

    // Set car position based on lane type
    if (lane.type === "horizontal") {
        car.y = lane.y;  // Set Y position from lane
        
        // If moving right, start on left side; if moving left, start on right side
        car.x = lane.vx > 0 ? -car.width : canvas.width;
    } else {
        car.x = lane.x;  // Set X position from lane
        
        // If moving down, start on top; if moving up, start on bottom
        car.y = lane.vy > 0 ? -car.height : canvas.height;
    }

    // Add new car to the cars array
    cars.push(car);
}

// ==============================================
// GAME STATE VARIABLES - Track game conditions
// ==============================================

let carSpawn = false;    // Whether cars should be spawning
let carsMoving = true;   // Whether cars should be moving

// ==============================================
// SPAWN LOOP FUNCTION - Continuously spawn cars
// ==============================================

// Function that keeps spawning cars at intervals
function spawnLoop() {
    // If spawning is disabled, stop the loop
    if (!carSpawn) return;

    // Spawn a new car
    spawnCar();
    
    // Schedule next spawn after 500ms (half a second)
    setTimeout(spawnLoop, 500);
}

// ==============================================
// BUTTON EVENT HANDLERS - Respond to button clicks
// ==============================================

// Start spawning cars when spawn button is clicked
spawnBtn.addEventListener("click", () => {
    if (!carSpawn) {
        carSpawn = true;    // Enable spawning
        spawnLoop();        // Start spawn loop
    }
});

// Stop spawning cars (but existing cars keep moving)
stopBtn.addEventListener("click", () => {
    carSpawn = false;  // Disable spawning
});

// Resume car movement and spawning
resumeBtn.addEventListener("click", () => {
    carsMoving = true;  // Allow cars to move
    
    if (!carSpawn) {
        carSpawn = true;    // Enable spawning
        spawnLoop();        // Start spawn loop
    }
});

// Stop all cars from moving and stop spawning
stoppingBtn.addEventListener("click", () => {
    carsMoving = false;  // Freeze all cars
    carSpawn = false;    // Stop spawning new cars
});

// ==============================================
// UPDATE FUNCTION - Update game state each frame
// ==============================================

// Function called every frame to update game logic
function update() {
    // Log current number of cars for debugging
    console.log("Cars in array:", cars.length);
    
    // Loop through all cars (backwards to safely remove cars)
    for (let i = cars.length - 1; i >= 0; i--) {
        const car = cars[i];  // Get current car

        // Move car if movement is enabled
        if (carsMoving) {
            car.x += car.vx;  // Update X position
            car.y += car.vy;  // Update Y position
        }
        
        // Check if car has moved off screen
        if (
            car.x > canvas.width ||        // Off right side
            car.x + car.width < 0 ||       // Off left side
            car.y > canvas.height ||       // Off bottom
            car.y + car.height < 0         // Off top
        ) {
            // Remove car from array (it has left the screen)
            cars.splice(i, 1);
        }
    }
}

// ==============================================
// DRAWING FUNCTIONS - Render game objects
// ==============================================

// Function to draw a single car
function drawCar(car) {
    // If car image hasn't loaded yet, draw a blue rectangle as placeholder
    if (!imagesLoaded.car) {
        ctx.fillStyle = "blue";
        ctx.fillRect(car.x, car.y, car.width, car.height);
        return;  // Exit function early
    }

    // Save current canvas state before transformations
    ctx.save();

    // Move drawing origin to car center for easier rotation
    ctx.translate(
        car.x + car.width / 2,  // New X origin (center of car)
        car.y + car.height / 2   // New Y origin (center of car)
    );

    // Rotate/flip car based on its direction
    if (car.vx > 0) {
        // Moving right → no rotation needed
    } 
    else if (car.vx < 0) {
        ctx.scale(-1, 1);  // Moving left → flip horizontally
    }
    else if (car.vy > 0) {
        ctx.rotate(Math.PI / 2);  // Moving down → rotate 90 degrees
    }
    else if (car.vy < 0) {
        ctx.rotate(-Math.PI / 2); // Moving up → rotate -90 degrees
    }

    // Draw car image centered at the new origin
    ctx.drawImage(
        carImg,                // Image to draw
        -car.width / 2,        // X position (centered)
        -car.height / 2,       // Y position (centered)
        car.width,             // Width to draw
        car.height             // Height to draw
    );

    // Restore canvas to original state
    ctx.restore();
}

// Function to draw everything on screen
function draw() {
    // Clear entire canvas before drawing new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw road background
    if (imagesLoaded.road) {
        // Draw loaded road image
        ctx.drawImage(roadImg, roadX, roadY, roadWidth, roadHeight);
    } else {
        // Draw placeholder road
        ctx.fillStyle = "#555";  // Gray color
        ctx.fillRect(0, roadY, roadWidth, roadHeight);
        
        // Draw road lines (dashed white line in middle)
        ctx.fillStyle = "white";
        for (let i = 0; i < roadWidth; i += 40) {
            ctx.fillRect(i, roadY + roadHeight / 2 - 2, 20, 4);
        }
    }

    // Draw stop sign
    const signWidth = 20;
    const signHeight = 60;
    if (imagesLoaded.sign) {
        // Draw loaded sign image
        ctx.drawImage(signImg, canvas.width / 2 - signWidth / 2, roadY, signWidth, signHeight);
    } else {
        // Draw placeholder sign (red rectangle)
        ctx.fillStyle = "red";
        ctx.fillRect(canvas.width / 2 - signWidth / 2, roadY, signWidth, signHeight);
        
        // Draw "S" on placeholder sign
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("S", canvas.width / 2, roadY + 25);
    }

    // Draw all cars
    cars.forEach(drawCar);

    // Draw loading status (for debugging)
    if (!imagesLoaded.car || !imagesLoaded.sign || !imagesLoaded.road) {
        // Create semi-transparent black background for status text
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(10, 10, 200, 60);
        
        // Set text properties
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.textAlign = "left";
        
        // Create status text array
        const status = [
            `Car: ${imagesLoaded.car ? '✓' : 'Loading...'}`,
            `Sign: ${imagesLoaded.sign ? '✓' : 'Loading...'}`,
            `Road: ${imagesLoaded.road ? '✓' : 'Loading...'}`
        ];
        
        // Draw each status line
        status.forEach((text, i) => {
            ctx.fillText(text, 20, 30 + i * 15);
        });
    }
}

// ==============================================
// GAME LOOP - Main animation loop
// ==============================================

// Main game loop function
function gameLoop() {
    update();  // Update game state
    draw();    // Draw everything
    
    // Request next animation frame (creates smooth animation)
    requestAnimationFrame(gameLoop);
}

// ==============================================
// START THE GAME - Initialize game loop
// ==============================================

// Start the game loop (game begins running)
gameLoop();
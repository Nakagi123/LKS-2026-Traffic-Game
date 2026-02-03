const road = document.getElementById("road")
const lightEl = document.getElementById("traffic-light")
const button = document.getElementById("button")

let cars = []

class TrafficLight {
  constructor() {
    this.states = ['green', 'yellow', 'red'];
    this.currentIndex = 0;
    this.state = this.states[this.currentIndex]
    this.render();
  }

  next() {
    this.currentIndex = 
        (this.currentIndex + 1) % this.states.length
    this.state = this.states[this.currentIndex]
    this.render()
  }

  render() {
    lightEl.style.background = this.state
  }
}

const trafficLight = new TrafficLight()

button.addEventListener("click", () => {
    trafficLight.next()
})

if (trafficLight.state === "green") trafficLight.next()
else if (trafficLight.state === "yellow") trafficLight.next()


class Car {
    constructor(x, y, direction = "up") {
        this.x = x
        this.y = y
        this.direction = direction
        this.length = 40 // or whatever fits your car div


        this.speed = 0
        this.maxSpeed = 2
        this.acceleration = 0.05

        this.el = document.createElement("div")
        this.el.className = "car"
        road.appendChild(this.el)
    }

    move(cars) {
        const stopLine = 300

        // 🚦 RED LIGHT STOP (direction-aware)
        if (trafficLight.state === "red") {
        const frontY =
            this.direction === "up" ? this.y : this.y + this.length
            // UP direction
            if (this.direction === "up") {
                if (frontY > stopLine + this.length) {
                    // already passed → commit
                } else if (frontY <= stopLine) {
                    this.speed = 0
                    this.y = stopLine
                    this.render()
                    return
                }
            }

            // DOWN direction
            if (this.direction === "down") {
                if (frontY < stopLine - this.length) {
                    // already passed → commit
                } else if (frontY >= stopLine) {
                    this.speed = 0
                    this.y = stopLine
                    this.render()
                    return
                }
            }
        }

        let nearestCar = null

        for (let car of cars) {
            if (car === this) continue
            if (car.x !== this.x) continue
            if (car.direction !== this.direction) continue

            const isAhead =
                this.direction === "up"
                    ? car.y < this.y
                    : car.y > this.y

            if (isAhead) {
                if (
                    !nearestCar ||
                    (this.direction === "up"
                        ? car.y > nearestCar.y
                        : car.y < nearestCar.y)
                ) {
                    nearestCar = car
                }
            }
        }

        if (nearestCar) {
            const distance = Math.abs(this.y - nearestCar.y)

            if (distance <= 60) {
                this.speed = 0
            } else if (distance <= 100) {
                this.speed = Math.max(this.speed - this.acceleration, 0)
            } else {
                this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed)
            }
        } else {
            this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed)
        }

        this.updatePosition()
        this.render()
    }

    updatePosition() {
        this.y += this.direction === "up" ? -this.speed : this.speed
    }

    render() {
        this.el.style.transform =
            `translate(${this.x}px, ${this.y}px) rotate(${this.direction === "up" ? -90 : 90}deg)`
    }

    isOut() {
        return this.direction === "up"
            ? this.y < -80
            : this.y > 880
    }

    destroy() {
        this.el.remove()
    }
}


const lanes = [
    { x: 110, direction: "up" },
    { x: 150, direction: "up" },
    { x: 190, direction: "down" },
    { x: 230, direction: "down" }
]

setInterval(() => {
    const lane = lanes[Math.floor(Math.random() * lanes.length)]

    const y = lane.direction === "up" ? 800 : -80

    cars.push(new Car(lane.x, y, lane.direction))
}, 600)



function gameLoop() {
    cars.forEach((car) => {
        car.move(cars)
    })

    cars = cars.filter(car => {
        if (car.isOut()) {
            car.destroy()
            return false
        }
        return true
    })

    requestAnimationFrame(gameLoop)
}

gameLoop()
const road = document.getElementById("road")
const lightEl = document.getElementById("traffic-light")

let cars = []

class TrafficLight {
    constructor() {
        this.state = "green"
        this.change()
    }

    change() {
        setTimeout(() => {
            this.state = "yellow"
            lightEl.style.background = "yellow"

            setTimeout(() => {
                this.state = "red"
                lightEl.style.background = "red"

                setTimeout(() => {
                    this.state = "green"
                    lightEl.style.background = "green"
                    this.change()
                }, 6000)

            }, 2000)

        }, 4000)
    }
}

const trafficLight = new TrafficLight()

class Car {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.speed = 0          // ← START STOPPED
        this.maxSpeed = 2
        this.acceleration = 0.05
        this.el = document.createElement("div")
        this.el.className = "car"
        road.appendChild(this.el)
}


    move(cars) {
        let stopLine = 300
        const TURN_LINE = 320

        // RED LIGHT STOP
        if (
            trafficLight.state === "red" &&
            this.y <= stopLine &&
            this.y >= stopLine - 10
        ) {
            this.speed = 0
            return
        }

        let nearestCar = null

        for (let car of cars) {
            if (car === this) continue
            if (car.x !== this.x) continue
            if (car.y < this.y) {
                if (!nearestCar || car.y > nearestCar.y) {
                    nearestCar = car
                }
            }
        }

        if (nearestCar) {
            const distance = this.y - nearestCar.y

            if (distance <= 40) {
                this.speed = 0
            } else if (distance <= 100) {
                this.speed = Math.max(this.speed - 0.1, 1)
            } else {
                this.speed = Math.min(
                    this.speed + this.acceleration,
                    this.maxSpeed
                )
            }
        } else {
            // no car in front → free acceleration
            this.speed = Math.min(
                this.speed + this.acceleration,
                this.maxSpeed
            )
        }

        this.y -= this.speed
        this.el.style.transform =
            `translate(${this.x}px, ${this.y}px) rotate(-90deg)`
    }


    isOut() {
        return this.y < -80
    }

    destroy() {
        this.el.remove()
    }


}

const lanes = [130, 170]

setInterval(() => {
    const laneX = lanes[Math.floor(Math.random() * lanes.length)]
    cars.push(new Car(laneX, 800))
}, 1000)

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
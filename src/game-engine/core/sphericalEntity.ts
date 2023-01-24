import GameEntity from "./gameEntity";
import Vector from "./vector";

abstract class SphericalEntity extends GameEntity {
    radius: number
    constructor(x: number, y: number, radius: number, velocity: Vector) {
        const top = y - radius
        const left = x - radius

        const div = document.createElement("div")
        div.style.width = 2 * radius + "px"
        div.style.height = 2 * radius + "px"

        super(left, top, velocity, div)
        this.radius = radius

        this.ref.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`
    }

    getCenter(): Vector {
        const top = this.position.y
        const left = this.position.x
        return Vector.fromComponents(left + this.radius, top + this.radius)
    }

    updatePosition(): void {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.ref.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`
    }
}

export default SphericalEntity
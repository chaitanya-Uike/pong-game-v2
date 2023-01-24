import GameEntity from "./gameEntity";
import { radianToDegree } from "../utils";
import Vector from "./vector";

abstract class RectEntity extends GameEntity {
    width: number
    height: number
    rotation: number = 0

    constructor(x: number, y: number, width: number, height: number, rotation: number, velocity: Vector) {

        const div = document.createElement("div")
        div.style.width = width + "px"
        div.style.height = height + "px"

        super(x, y, velocity, div)
        this.width = width
        this.height = height
        this.rotation = rotation
        this.ref.style.transform = `translate(${this.position.x}px, ${this.position.y}px) rotate(${radianToDegree(this.rotation)}deg)`
    }

    updatePosition(): void {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.ref.style.transform = `translate(${this.position.x}px, ${this.position.y}px) rotate(${radianToDegree(this.rotation)}deg)`
    }

    getCenter() {
        const x = this.position.x + this.width / 2
        const y = this.position.y + this.height / 2

        return Vector.fromComponents(x, y)
    }
}

export default RectEntity
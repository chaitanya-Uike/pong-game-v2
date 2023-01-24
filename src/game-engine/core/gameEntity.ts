import Vector from "./vector"

export default abstract class GameEntity {
    position: Vector
    velocity: Vector
    ref: HTMLDivElement

    constructor(x: number, y: number, velocity: Vector, elem: HTMLDivElement) {
        this.position = Vector.fromComponents(x, y)
        this.ref = elem
        this.velocity = velocity
        this.ref.style.position = "absolute"
        this.ref.style.transformOrigin = "center center"
    }

    abstract updatePosition(): void

    abstract getCenter(): Vector
}
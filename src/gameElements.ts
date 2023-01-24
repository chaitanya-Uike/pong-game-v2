import RectEntity from "./game-engine/core/RectEntity";
import SphericalEntity from "./game-engine/core/sphericalEntity";
import Vector from "./game-engine/core/vector";

export class Ball extends SphericalEntity {
    constructor(x: number, y: number, radius: number, velocity: Vector) {
        super(x, y, radius, velocity)
        this.ref.classList.add("ball")
    }
}

export class Wall extends RectEntity {
    constructor(x: number, y: number, width: number, height: number, rotation: number) {
        super(x, y, width, height, rotation, new Vector())
        this.ref.classList.add("wall")
    }
}

export class Paddle extends RectEntity {
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height, 0, new Vector())
        this.ref.classList.add("paddle")
    }
}
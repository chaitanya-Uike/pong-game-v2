import Vector from "./game-engine/core/vector";
import Game from "./game-engine/index";
import { degreeToRadian } from "./game-engine/utils";
import { Ball, Wall, Paddle } from "./gameElements";

const selector = ".playArea"
const pW = 800 //playAreaWidth
const pH = 500 //playAreaHeight

class PongGame extends Game {
    constructor() {
        super(selector, pW, pH)
    }

    initialize() {
        const ball = new Ball(20, 20, 10, Vector.fromMagnitudeAndTheta(3, degreeToRadian(45)))
        // boundry walls
        const floor = new Wall(0, pH, pW, 5, 0)
        const rightWall = new Wall(pW - pH / 2, pH / 2, pH, 5, degreeToRadian(90))
        const ceiling = new Wall(0, -5, pW, 5, 0)
        const leftWall = new Wall(-pH / 2, pH / 2, pH, 5, degreeToRadian(90))
        // paddles
        const paddleHeight = 100
        const paddleWidth = 10
        const leftPaddle = new Paddle(0, pH / 2 - paddleHeight / 2, paddleWidth, paddleHeight)
        const rightPaddle = new Paddle(pW - paddleWidth, pH / 2 - paddleHeight / 2, paddleWidth, paddleHeight)

        // add all entities to game
        this.addEntity(ball)
        this.addEntity([floor, rightWall, ceiling, leftWall])
        this.addEntity([leftPaddle, rightPaddle])

        this.addPaddleInteractions(leftPaddle, "w", "s")
        this.addPaddleInteractions(rightPaddle, "i", "k")

        // prevent paddles from getting out of bounds
        this.stopFromgettingOutOfBounds(leftPaddle, ceiling, floor)
        this.stopFromgettingOutOfBounds(rightPaddle, ceiling, floor)

        this.handleGameOver(ball, leftWall, rightWall)
    }


    addPaddleInteractions(paddle: Paddle, moveUpkey: string, movedownKey: string) {
        const paddleVelocity = Vector.fromComponents(0, 3)
        const nullVelocity = new Vector()

        this.keyboardManager.on("keydown", moveUpkey, () => {
            paddle.velocity = paddleVelocity.scalerMultiply(-1)
        })
        this.keyboardManager.on("keyup", moveUpkey, () => {
            paddle.velocity = nullVelocity
        })
        this.keyboardManager.on("keydown", movedownKey, () => {
            paddle.velocity = paddleVelocity
        })
        this.keyboardManager.on("keyup", movedownKey, () => {
            paddle.velocity = nullVelocity
        })
    }

    stopFromgettingOutOfBounds(paddle: Paddle, ceiling: Wall, floor: Wall) {
        this.collisionManager.onCollision(paddle, ceiling, () => {
            paddle.position.y = 0
        })
        this.collisionManager.onCollision(paddle, floor, () => {
            paddle.position.y = this.playAreaHeight - paddle.height
        })
    }

    handleGameOver(ball: Ball, leftWall: Wall, rightWall: Wall) {
        this.collisionManager.onCollision(ball, leftWall, () => {
            this.stop()
        })
        this.collisionManager.onCollision(ball, rightWall, () => {
            this.stop()
        })
    }
}

const pg = new PongGame()

pg.play()

pg.onGameOver = function () {
    console.log("game over")
}
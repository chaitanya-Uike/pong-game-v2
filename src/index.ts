import Vector from "./game-engine/core/vector";
import Game from "./game-engine/index";
import { degreeToRadian } from "./game-engine/utils";
import { Ball, Wall, Paddle } from "./gameElements";
const playBtn = document.querySelector(".play") as HTMLButtonElement
const restartBtn = document.querySelector(".restart") as HTMLButtonElement

const selector = ".playArea"
const pW = 700 //playAreaWidth
const pH = 400 //playAreaHeight

class PongGame extends Game {
    constructor() {
        super(selector, pW, pH)
    }

    initialize() {
        const ballRadius = 5
        // generate a random launch angle
        const launchAngles = [45, -45, 135, -135]
        const index = Math.floor(Math.random() * launchAngles.length)
        const ballVelocity = Vector.fromMagnitudeAndTheta(3, degreeToRadian(launchAngles[index]))
        const ball = new Ball(pW / 2 - 1.5, pH / 2 - ballRadius, 10, ballVelocity)
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

        const midLine = document.createElement("div")
        midLine.classList.add("midLine")

        this.playAreaRef.appendChild(midLine)

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

let isPlaying = false

playBtn.onclick = () => {
    if (!isPlaying) {
        isPlaying = true
        pg.play()
        playBtn.innerHTML = "Pause"
        restartBtn.style.display = "inline-block"
    } else {
        isPlaying = false
        pg.pause()
        playBtn.innerHTML = "Play"
        restartBtn.style.display = ""
    }
}

restartBtn.onclick = () => {
    pg.reset()
}

pg.onGameOver = function () {
    isPlaying = false
    playBtn.innerHTML = "Play"
    restartBtn.style.display = ""
}
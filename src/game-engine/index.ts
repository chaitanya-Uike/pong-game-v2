import CollisionManager from "./helpers/collisionManager"
import GameEntity from "./core/gameEntity"
import KeyboardManager from "./helpers/keyboardManager"

export enum GameState {
    playing,
    paused,
    over,
    idle
}

export default abstract class Game {
    playAreaRef: HTMLDivElement
    playAreaWidth: number
    playAreaHeight: number
    entities: GameEntity[] = []
    collisionManager = new CollisionManager()
    keyboardManager = new KeyboardManager()
    state: GameState = GameState.idle

    constructor(playAreaSelector: string, playAreaWidth: number, playAreaHeight: number) {
        this.playAreaRef = document.querySelector(playAreaSelector) as HTMLDivElement
        this.playAreaRef.style.width = playAreaWidth + "px"
        this.playAreaRef.style.height = playAreaHeight + "px"
        this.playAreaWidth = playAreaWidth
        this.playAreaHeight = playAreaHeight

        this.initialize()
    }

    abstract initialize(): void

    addEntity(arg: GameEntity[] | GameEntity) {
        if (Array.isArray(arg)) {
            arg.forEach(entity => {
                this.entities.push(entity)
                this.playAreaRef.appendChild(entity.ref)
            })
        } else {
            this.entities.push(arg)
            this.playAreaRef.appendChild(arg.ref)
        }
    }

    render() {
        if (this.state !== GameState.playing) return

        this.collisionManager.eventDispatcher(this.entities)
        this.entities.forEach(entity => {
            entity.updatePosition()
        })
        requestAnimationFrame(this.render.bind(this))
    }

    play() {
        if (this.state === GameState.playing) return
        this.state = GameState.playing
        this.render()
    }

    pause() {
        this.state = GameState.paused
    }

    stop() {
        this.state = GameState.over
        this.onGameOver()
    }

    reset() {
        this.playAreaRef.innerHTML = ""
        this.entities = []
        this.collisionManager.unsubscribe()
        this.keyboardManager.unsubscribe()
        this.initialize()
    }

    // override this method as needed
    onGameOver() { }
}

import GameEntity from "../core/gameEntity";
import RectEntity from "../core/RectEntity";
import SphericalEntity from "../core/sphericalEntity";
import PhysicsEngine from "./PhysicsEngine";

export default class CollisionManager {
    physicsEngine: PhysicsEngine = new PhysicsEngine()
    events: CollisionEvent[] = [];


    eventDispatcher(entities: GameEntity[]) {
        for (let i = 0; i < entities.length; i++) {
            for (let j = i + 1; j < entities.length; j++) {
                let collisionDetected = false

                const entity1 = entities[i]
                const entity2 = entities[j]

                const e1isRect = entity1 instanceof RectEntity
                const e2isRect = entity2 instanceof RectEntity
                const e1isSphere = entity1 instanceof SphericalEntity
                const e2isShphere = entity2 instanceof SphericalEntity

                if (e1isRect && e2isRect) {
                    if (this.detectCollisionBetweenRects(entity1, entity2)) {
                        collisionDetected = true
                    }
                }
                else if (e1isSphere && e2isShphere) {
                    if (this.detectCollisionBetweenSpheres(entity1, entity2)) {
                        collisionDetected = true
                        const collisionDetails = this.physicsEngine.getVelocityAfterCollision(entity1, entity2)

                        entity1.velocity = collisionDetails.velocity1
                        entity2.velocity = collisionDetails.velocity2
                    }
                }
                else if (e1isRect && e2isShphere) {
                    if (this.detectCollisionBetweenRectAndSphere(entity1, entity2)) {
                        collisionDetected = true
                        const collisionDetails = this.physicsEngine.getVelocityAfterCollision(entity1, entity2)

                        entity1.velocity = collisionDetails.velocity1
                        entity2.velocity = collisionDetails.velocity2
                    }
                } else if (e1isSphere && e2isRect) {
                    if (this.detectCollisionBetweenRectAndSphere(entity2, entity1)) {
                        collisionDetected = true
                        const collisionDetails = this.physicsEngine.getVelocityAfterCollision(entity1, entity2)

                        entity1.velocity = collisionDetails.velocity1
                        entity2.velocity = collisionDetails.velocity2
                    }
                }

                // dispatch events
                if (collisionDetected) {
                    const event = this.events.find((event) => {
                        return event.entity1 === entity1 && event.entity2 === entity2 || event.entity1 === entity2 && event.entity2 === entity1;
                    });

                    if (event)
                        event.handler();
                }
            }
        }
    }

    onCollision(
        entity1: GameEntity,
        entity2: GameEntity,
        handler: Function
    ) {
        this.events.push({ entity1, entity2, handler });
    }

    off(
        entity1: GameEntity,
        entity2: GameEntity,
        handler: Function
    ) {
        const idx = this.events.findIndex(
            (event) =>
                event.entity1 === entity1 &&
                event.entity2 === entity2 &&
                event.handler === handler
        );

        this.events.splice(idx, 1);
    }

    unsubscribe() {
        this.events = []
    }

    detectCollisionBetweenRects(rect1: RectEntity, rect2: RectEntity): boolean {
        if (
            rect1.position.x < rect2.position.x + rect2.width &&
            rect1.position.x + rect1.width > rect2.position.x &&
            rect1.position.y < rect2.position.y + rect2.height &&
            rect1.height + rect1.position.y > rect2.position.y
        )
            return true;

        return false;
    }

    detectCollisionBetweenSpheres(sphere1: SphericalEntity, sphere2: SphericalEntity) {
        if (sphere1.getCenter().getDistanceBetween(sphere2.getCenter()) <= sphere1.radius + sphere2.radius)
            return true
        return false
    }

    detectCollisionBetweenRectAndSphere(rect: RectEntity, sphere: SphericalEntity) {
        const cx = sphere.getCenter().x
        const cy = sphere.getCenter().y
        const cr = sphere.radius

        const rx = rect.position.x
        const ry = rect.position.y
        const rcX = rect.getCenter().x
        const rcY = rect.getCenter().y

        // Rotate circle's center point back
        const unrotatedCircleX = Math.cos(-rect.rotation) * (cx - rcX) -
            Math.sin(-rect.rotation) * (cy - rcY) + rcX;
        const unrotatedCircleY = Math.sin(-rect.rotation) * (cx - rcX) +
            Math.cos(-rect.rotation) * (cy - rcY) + rcY;

        // Closest point in the rectangle to the center of circle rotated backwards(unrotated)
        let closestX, closestY;

        // Find the unrotated closest x point from center of unrotated circle
        if (unrotatedCircleX < rx)
            closestX = rx;
        else if (unrotatedCircleX > rx + rect.width)
            closestX = rx + rect.width;
        else
            closestX = unrotatedCircleX;

        // Find the unrotated closest y point from center of unrotated circle
        if (unrotatedCircleY < ry)
            closestY = ry;
        else if (unrotatedCircleY > ry + rect.height)
            closestY = ry + rect.height;
        else
            closestY = unrotatedCircleY;

        const distance = Math.sqrt((unrotatedCircleX - closestX) * (unrotatedCircleX - closestX) + (unrotatedCircleY - closestY) * (unrotatedCircleY - closestY))

        if (distance <= cr)
            return true

        return false
    }

}
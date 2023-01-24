interface keydownDetails {
    isHeld: boolean;
    handlers: Function[];
}

interface keydownTable {
    [key: string]: keydownDetails;
}

interface keyupTable {
    [key: string]: Function[];
}

interface CollisionEvent {
    entity1: GameEntity;
    entity2: GameEntity;
    handler: Function
}
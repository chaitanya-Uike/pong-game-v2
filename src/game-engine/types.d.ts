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

export const day8 = (input: string[]) => {
    const part1Result: number = part1(input);
    const part2Result: number = part2(input);
    return { part1: part1Result, part2: part2Result};
};

export type Coord = {
    x: number;
    y: number;
    z: number;
}

export const parseInput = (input: string[]): Coord[] => {
    const coords: Coord[] = input.map(line => {
        const [xStr, yStr, zStr] = line.split(",").map(token => token.trim());
        return {
            x: parseInt(xStr!, 10),
            y: parseInt(yStr!, 10),
            z: parseInt(zStr!, 10)
        };
    });
    return coords;
};

export const getDistance = (a: Coord, b: Coord): number => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
};

export const findClosestPair = (coords: Coord[]): [Coord, Coord] => {
    if (coords.length < 2) throw new Error("At least two coordinates are required to find a closest pair.");
    let minDistance = Infinity;
    let closestPair: [Coord, Coord] = [coords[0]!, coords[1]!];
    for (let i = 0; i < coords.length; i++) {
        for (let j = i + 1; j < coords.length; j++) {
            const dist = getDistance(coords[i]!, coords[j]!);
            if (dist < minDistance) {
                minDistance = dist;
                closestPair = [coords[i]!, coords[j]!];
            }
        }
    }
    return closestPair;
};

type CoordPairDistance = {
    coordA: Coord;
    coordB: Coord;
    distance: number;
};

export const buildDistanceList = (coords: Coord[]): CoordPairDistance[] => {
    const distanceList: CoordPairDistance[] = [];
    for (let i = 0; i < coords.length; i++) {
        for (let j = i + 1; j < coords.length; j++) {
            const dist = getDistance(coords[i]!, coords[j]!);
            distanceList.push({
                coordA: coords[i]!,
                coordB: coords[j]!,
                distance: dist
            });
        }
    }
    //sort descending
    return distanceList.sort((a, b) => b.distance - a.distance);
};

export type Circuit = Set<Coord>;

export const buildCircuits = (coords: Coord[], connectionsToMake: number): Circuit[] => {
    const distanceList = buildDistanceList(coords);
    let circuits: Circuit[] = [];
    let coordToCircuitMap: Map<Coord, Circuit> = new Map();
    for (const coord of coords) {
        const newCircuit: Circuit = new Set();
        newCircuit.add(coord);
        circuits.push(newCircuit);
        coordToCircuitMap.set(coord, newCircuit);
    }
    let connectionsMade = 0;
    while (connectionsMade < connectionsToMake && distanceList.length > 0) {
        const {coordA, coordB} = distanceList.pop()!;
        console.log(`Connecting (${coordA.x},${coordA.y},${coordA.z}) and (${coordB.x},${coordB.y},${coordB.z})`);
        const result = connectCircuits(coordA, coordB, coordToCircuitMap, circuits);
        coordToCircuitMap = result.coordToCircuitMap;
        circuits = result.circuits;
        connectionsMade++;
    }
    //sort circuits by size descending
    return circuits.sort((a, b) => b.size - a.size);
};


//breaking the connection section out of buildCirctuits to allow for easier testing
export const connectCircuits = (coordA: Coord, coordB: Coord, coordToCircuitMap: Map<Coord, Circuit>, circuits: Circuit[]):
    {coordToCircuitMap: Map<Coord, Circuit>, circuits: Circuit[]} => {
    const circuitA = coordToCircuitMap.get(coordA)!;
    const circuitB = coordToCircuitMap.get(coordB)!;
    if (circuitA !== circuitB) {
        //merge circuits
        for (const coord of circuitB) {
            circuitA.add(coord);
            coordToCircuitMap.set(coord, circuitA);
        }
        //remove circuitB from circuits list
        const index = circuits.indexOf(circuitB);
        if (index > -1) {
            circuits.splice(index, 1);
        }
    }
    return {coordToCircuitMap, circuits};
}

export const connectUntilSingleCircuit = (coords: Coord[]): {coordA: Coord; coordB: Coord} | null => {
    const distanceList = buildDistanceList(coords);
    let circuits: Circuit[] = [];
    let coordToCircuitMap: Map<Coord, Circuit> = new Map();
    for (const coord of coords) {
        const newCircuit: Circuit = new Set();
        newCircuit.add(coord);
        circuits.push(newCircuit);
        coordToCircuitMap.set(coord, newCircuit);
    }
    let lastConnection: {coordA: Coord; coordB: Coord} | null = null;
    while (circuits.length > 1) {
        if (distanceList.length === 0) throw new Error("Ran out of connections");
        const {coordA, coordB} = distanceList.pop()!;
        
        const result = connectCircuits(coordA, coordB, coordToCircuitMap, circuits);
        coordToCircuitMap = result.coordToCircuitMap;
        circuits = result.circuits;
        lastConnection = {coordA, coordB};
    }
    return lastConnection;
};

export const multiplyThreeBiggestCircuitSizes = (circuits: Circuit[]): number => {
    return circuits[0]!.size * circuits[1]!.size * circuits[2]!.size;
};

export const multXCoordsOfLastConnection = (lastConnection: {coordA: Coord; coordB: Coord} | null): number => {
    if (!lastConnection) return 0;
    return lastConnection.coordA.x * lastConnection.coordB.x;
};



export const part1 = (input: string[]): number => {
    return multiplyThreeBiggestCircuitSizes(buildCircuits(parseInput(input), 1000));
};

export const part2 = (input: string[]): number => {
    const lastConnection = connectUntilSingleCircuit(parseInput(input));
    return multXCoordsOfLastConnection(lastConnection);
};
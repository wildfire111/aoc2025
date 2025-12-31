import { count } from "console";

export const day9 = (input: string[]) => {
    const part1Result: number = part1(input);
    const part2Result: number = part2(input);
    return { part1: part1Result, part2: part2Result};
};

export type Coord = {
    x: number;
    y: number;
};

export const parseInput = (input: string[]): Coord[] => {
    return input.map(line => {
        const split = line.split(",").map(v => parseInt(v.trim(), 10));
        return { x: split[0]!, y: split[1]! };
    });
};

export const areaBetweenCoords = ({coordA, coordB}: {coordA: Coord, coordB: Coord}): number => {
    const width = Math.abs(coordA.x - coordB.x) + 1;
    const height = Math.abs(coordA.y - coordB.y) + 1;
    return width * height;
};

export const findBiggestArea = (coords: Coord[]): { biggestArea: number, coordA: Coord, coordB: Coord } => {
    let biggestArea = 0;
    if (coords.length < 2) {
        throw new Error("At least two coordinates are required to calculate area.");
    }
    let coordA: Coord = coords[0]!;
    let coordB: Coord = coords[1]!;
    
    for (let i = 0; i < coords.length; i++) {
        for (let j = i + 1; j < coords.length; j++) {
            const area = areaBetweenCoords({coordA: coords[i]!, coordB: coords[j]!});
            if (area > biggestArea) {
                biggestArea = area;
                coordA = coords[i]!;
                coordB = coords[j]!;
                
            }
        }
    }
    return { biggestArea, coordA, coordB };
};

export const printGrid = (coords: Coord[]): void => {
    const maxX = Math.max(...coords.map(c => c.x));
    const maxY = Math.max(...coords.map(c => c.y));
    const grid: string[][] = [];
    for (let y = 0; y <= maxY; y++) {
        const row: string[] = [];
        for (let x = 0; x <= maxX; x++) {
            row.push(".");
        }
        grid.push(row);
    }
    for (const coord of coords) {
        grid[coord.y]![coord.x] = "#";
    }
    const numString: string[] = [' '];
    for (let x = 0; x <= maxX; x++) {
        numString.push((x).toString());
    }
    console.log(numString.join(""));
    for (let i = 0; i < grid.length; i++) {
        const row = grid[i]!;
        row.unshift(i.toString());

        console.log(row.join(""));
    }
};


//shoot a ray from left to right and top to bottom, flipping flag on each intersection
//collect pairs of intersections to form horizontal segments inside the shape
//each x and y has a corresponding list of segments.
//to check if a point is inside, check if its x is within any segment for that y, and its y is within any segment for that x

export type IntersectMaps = {
    intersectsOnX: Map<number, number[]>;
    horizontalSpansOnY: Map<number, Array<[number, number]>>;
};

export const buildIntersectMap = (cornerList: Coord[]): { intersectsOnX: Map<number, number[]>, horizontalSpansOnY: Map<number, Array<[number, number]>> } => {
    const intersectsOnX: Map<number, number[]> = new Map();
    const horizontalSpansOnY = new Map<number, Array<[number, number]>>();
    const maxY = Math.max(...cornerList.map(c => c.y));
    //add the first corner to the end to close the shape without mutating input
    const points = [...cornerList, cornerList[0]!];
    //horizontal ray

    for (let y = 0; y <= maxY; y++) { //iter over rows

        let intersections: number[] = [];
        
        for (let i = 0; i < points.length - 1; i++) { //iter over each point
            const a = points[i]!;
            const b = points[i + 1]!; //build edge endpoints
            if (a.y === b.y) { //horizontal edge
                // horizontal edge: record span for on-edge checks
                const y = a.y;
                const minX = Math.min(a.x, b.x);
                const maxX = Math.max(a.x, b.x);
                const spans = horizontalSpansOnY.get(y) ?? [];
                spans.push([minX, maxX]);
                horizontalSpansOnY.set(y, spans);
                continue;
            }
            const topY = Math.min(a.y, b.y);
            const bottomY = Math.max(a.y, b.y);
            
            if (y >= topY && y < bottomY) { //ray intersects edge
                //intersect at x of edge
                intersections.push(a.x);
            }
        }
        intersections.sort((a, b) => a - b);
        intersectsOnX.set(y, intersections);
        
    }
    //sort spans
    for (const [y, spans] of horizontalSpansOnY.entries()) {
        spans.sort((a, b) => a[0] - b[0]);
        horizontalSpansOnY.set(y, spans);
    }
    //condense spans if overlapping
    for (const [y, spans] of horizontalSpansOnY.entries()) {
        const condensed: Array<[number, number]> = [];
        let currentSpan: [number, number] | null = null;
        for (const span of spans) {
            if (!currentSpan) {
                currentSpan = span;
                continue;
            }
            if (span[0] <= currentSpan[1]) { //overlap
                currentSpan[1] = Math.max(currentSpan[1], span[1]);
            } else {
                condensed.push(currentSpan);
                currentSpan = span;
            }
        }
        if (currentSpan) {
            condensed.push(currentSpan);
        }
        horizontalSpansOnY.set(y, condensed);
    }

    return { intersectsOnX, horizontalSpansOnY };
};

export const isPointInShape = (point: Coord, maps: IntersectMaps): boolean => {
    const xIntersections = maps.intersectsOnX.get(point.y);
    const spans = maps.horizontalSpansOnY.get(point.y);
    
    if (!xIntersections) {
        return false;
    }
    //console.log(`${JSON.stringify(point)} has intersections at X: ${xIntersections.join(",")}`);
    if (xIntersections.includes(point.x)) {
        //console.log(`Point ${point.x},${point.y} is on edge.`);
        return true; //on edge is considered inside

    }
    let inside = false;
    for (let i = 0; i < xIntersections.length; i += 1) {
        if (point.x >= xIntersections[i]!) {
            inside = !inside;
            //console.log(`Index ${point.x} flips ${inside ? "inside" : "outside"} at intersection ${xIntersections[i]}`);
            
        } else {
            //console.log(`Index ${point.x} ends ${inside ? "inside" : "outside"} at intersection ${xIntersections[i]}`);
            break;
        }
    }
    if (inside) {
        return true;
    }
    if (spans) {
        for (const span of spans) {
            if (point.x >= span[0] && point.x <= span[1]) {
                //console.log(`Point ${point.x},${point.y} is on horizontal edge span ${span[0]}-${span[1]}.`);
                return true; //on edge is considered inside
            }
        }
    }
    return false;

};



export const isRectangleInsideShape = (coordA: Coord, coordB: Coord, maps: IntersectMaps): boolean => {

    const minX = Math.min(coordA.x, coordB.x);
    const maxX = Math.max(coordA.x, coordB.x);
    const minY = Math.min(coordA.y, coordB.y);
    const maxY = Math.max(coordA.y, coordB.y);

    //check other two corners
    const cornerC: Coord = { x: coordA.x, y: coordB.y };
    const cornerD: Coord = { x: coordB.x, y: coordA.y };
    if (!isPointInShape(cornerC, maps)) { 
        //console.log(`${JSON.stringify(cornerC)} corner fail`); 
        return false; 
    }
    if (!isPointInShape(cornerD, maps)) { 
        //console.log(`${JSON.stringify(cornerD)} corner fail`); 
        return false; 
    }

    for (let x = minX; x <= maxX; x++) {
        if (!isPointInShape({ x, y: minY }, maps)) {
            //console.log("top edge fail");
            return false;
        }
        if (!isPointInShape({ x, y: maxY }, maps)) {
            //console.log("bottom edge fail");
            return false;
        }
    }
    for (let y = minY + 1; y < maxY; y++) {
        if (!isPointInShape({ x: minX, y }, maps)) {
            //console.log("left edge fail");
            return false;
        }
        if (!isPointInShape({ x: maxX, y }, maps)) {
            //console.log("right edge fail");
            return false;
        }
    }
    return true;
    
};

export type AreaResult = {
    area: number;
    coordA: Coord;
    coordB: Coord;
};

export const findBiggestRectangleInsideShape = (coords: Coord[], maps: IntersectMaps): AreaResult => {
    const rectangleAreas: AreaResult[] = [];
    for (let i = 0; i < coords.length; i++) {
        for (let j = i + 1; j < coords.length; j++) {
            const coordA = coords[i]!;
            const coordB = coords[j]!;
            const area = areaBetweenCoords({coordA, coordB});
            rectangleAreas.push({ area, coordA, coordB });
        }
    }
    rectangleAreas.sort((a, b) => b.area - a.area);
    let count = 0;
    const start = performance.now();
    let lastLog = start;
    let rateArray : number[] = [];
    let lastCount = 0;
    for (const rectangle of rectangleAreas) {
        if (isRectangleInsideShape(rectangle.coordA, rectangle.coordB, maps)) {
            return rectangle;
        }
        count++;
        const now = performance.now();
        if (now - lastLog > 2000) {
            const rate = (count - lastCount) / ((now - lastLog) / 1000);
            if (rateArray.length >= 10) {
                rateArray.shift();
            }
            rateArray.push(rate);
            const averageRate = rateArray.reduce((a, b) => a + b, 0) / rateArray.length;
            const remaining = rectangleAreas.length - count;
            const estimatedMinutesLeft = Math.floor(remaining / averageRate / 60);
            const estimatedSecondsLeft = (remaining / averageRate) % 60;
            console.log(`Checked ${count}/${rectangleAreas.length} rectangles. Estimated time left: ${estimatedMinutesLeft}m ${estimatedSecondsLeft.toFixed(1)}s`);
            lastLog = now;
            lastCount = count;
        }
    }
    throw new Error("No rectangle found inside shape.");
    
};


export const part1 = (input: string[]): number => {
    const coords = parseInput(input);
    const result = findBiggestArea(coords);
    return result.biggestArea;
};

export const part2 = (input: string[]): number => {
    const coords = parseInput(input);
    const maps = buildIntersectMap(coords);
    console.log("Built intersect map, finding biggest rectangle inside shape...");
    const result = findBiggestRectangleInsideShape(coords, maps);
    return result.area;
};
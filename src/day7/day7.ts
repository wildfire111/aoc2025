import type { constants } from "fs/promises";
import { get } from "http";

export const day7 = (input: string[]) => {
    const part1Result: number = part1(input);
    const part2Result: number = part2(input);
    return { part1: part1Result, part2: part2Result};
};

export const getChar = (input: string[], coords: {x: number, y: number}): string => {
    const {x, y} = coords;
    if (y < 0 || y >= input.length) {
        return "?";
    }
    if (x < 0 || x >= input[y]!.length) {
        return "?";
    }
    return input[y]![x]!;
};

export const isSplitterAndShouldSplit = (input: string[], coords: {x: number, y: number}): boolean => {
    const char = getChar(input, coords);
    const up = getChar(input, {x: coords.x, y: coords.y - 1});
    //console.log(`Checking splitter at (${coords.x}, ${coords.y}): char='${char}', up='${up}'`);
    if (char === "^" && up === "|") {
        return true;
    }
    return false;
};

export const replaceChar = (input: string[], coords: {x: number, y: number}, newChar: string): string[] => {
    const {x, y} = coords;
    if (y < 0 || y >= input.length) {
        return input;
    }
    if (x < 0 || x >= input[y]!.length) {
        return input;
    }
    input[y] = input[y]!.slice(0, x) + newChar + input[y]!.slice(x + 1);
    return input;
};

export const splitAt = (input: string[], coords: {x: number, y: number}): {input: string[], splitCount: number} => {
    const {x, y} = coords;
    const left = getChar(input, {x: x - 1, y});
    const right = getChar(input, {x: x + 1, y});
    let splitCount = 0;
    if (left === ".") {
        input = replaceChar(input, {x: x - 1, y}, "|");
        splitCount = 1;
    }
    if (right === ".") {
        input = replaceChar(input, {x: x + 1, y}, "|");
        splitCount = 1;
    }
    return {input, splitCount};
};

export const propagateBeams = (input: string[]): {output: string[], totalSplits: number} => {
    let totalSplits = 0;
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y]!.length; x++) {
            const upY = y - 1;
            if (isSplitterAndShouldSplit(input, {x, y})) {
                const {input: newInput, splitCount} = splitAt(input, {x, y});
                totalSplits += splitCount;
                input = newInput;
            } else if ((getChar(input, {x, y: upY}) === "|" || getChar(input, {x, y: upY}) === "S") && getChar(input, {x, y}) === ".") {
                input = replaceChar(input, {x, y}, "|");
            }
        }
    }
    return {output: input, totalSplits}
};

// export const quantumPaths = (finishedGraph: string[], toExplore: {x: number, y: number}, paths: number): number => {
//     //recursive function to explore all split path possibilities
//     console.log(`Exploring at (${toExplore.x}, ${toExplore.y})`);
//     const {x, y} = toExplore;
//     if (y >= finishedGraph.length) { //base case: reached bottom
//         console.log(`Reached bottom at (${x}, ${y})`);
//         return paths;
//     }
//     const node = getChar(finishedGraph, {x, y});
//     if (node === "?") { //out of bounds
//         console.log(`Out of bounds at (${x}, ${y})`);
//         return paths;
//     }
//     if (node === "|" || node === "S") { //beam or emitter, continue down
//         console.log(`Continuing down at (${x}, ${y})`);
//         return paths + quantumPaths(finishedGraph, {x, y: y + 1}, 0);
//     }
//     if (node === "^") { //splitter, branch left and right
//         console.log(`Splitting at (${x}, ${y})`);
//         const leftChar = getChar(finishedGraph, {x: x - 1, y: y});
//         const rightChar = getChar(finishedGraph, {x: x + 1, y: y});
//         let leftPaths = 0;
//         let rightPaths = 0;
//         if (leftChar === "|") {
//             leftPaths += quantumPaths(finishedGraph, {x: x - 1, y: y}, paths+1);
//         }
//         if (rightChar === "|") {
//             rightPaths += quantumPaths(finishedGraph, {x: x + 1, y: y}, paths+1);

//         }
//         return leftPaths + rightPaths;
//     }
//     //empty space, stop exploring
//     throw new Error(`Unexpected character '${node}' at (${x}, ${y})`);
// };



export const exploreNode = (finishedGraph: string[], coords: {x: number, y: number}): {x: number, y: number}[] => {
    const {x, y} = coords;
    const node = getChar(finishedGraph, {x, y});
    //console.log(`Exploring node at (${x}, ${y}): '${node}'`);
    if (node === "?") {
        return [];
    }
    if (node === "|" || node === "S") {
        return [{x, y: y + 1}];
    }
    if (node === "^") {
        const nextNodes: {x: number, y: number}[] = [];
        const leftChar = getChar(finishedGraph, {x: x - 1, y});
        const rightChar = getChar(finishedGraph, {x: x + 1, y});
        if (leftChar === "|") {
            nextNodes.push({x: x - 1, y});
        }
        if (rightChar === "|") {
            nextNodes.push({x: x + 1, y});
        }
        return nextNodes;
    }
    return [];
};

export const quantumPaths = (finishedGraph: string[], from: {x: number, y: number}, pathsSoFar: number): number => {
    const fullyExplored: Map<{x: number, y: number}, number> = new Map();
    const {x, y} = from;
    console.log(`Starting quantum path exploration from (${x}, ${y})`);
    const frontier = exploreNode(finishedGraph, {x, y});
    console.log(`Initial frontier: ${JSON.stringify(frontier)}`);
    while (frontier.length > 0) {
        const current = frontier.pop()!;
        if (current.y >= finishedGraph.length) {
            //console.log(`Reached bottom at (${current.x}, ${current.y})`);
            pathsSoFar += 1;
            continue;
        }
        const nextNodes = exploreNode(finishedGraph, current);
        //console.log(`Exploring from (${current.x}, ${current.y}), next nodes: ${JSON.stringify(nextNodes)}`);
        for (const next of nextNodes) {
            frontier.push(next);
        }
    }
    return pathsSoFar;
};
type Node = {
    parents: Node[];
    children: Node[];
}
export const buildGraph = (input: string[]): Node => {
    console.log("Building graph from input:");
    const drawnGraph = propagateBeams(input).output;
    const nodeLocations: Map<string, Node> = new Map();
    const start: Node = {
        parents: [],
        children: [],
    };
    const startCoords = {x: input[0]!.indexOf("S"), y: 0};
    nodeLocations.set(`${startCoords.x},${startCoords.y}`, start);
    const frontier: {x: number, y: number}[] = [startCoords];
    while (frontier.length > 0) {
        const currentCoords = frontier.pop()!;
        //console.log(`Exploring (${currentCoords.x}, ${currentCoords.y})`);
        const currentKey = `${currentCoords.x},${currentCoords.y}`;
        const currentNode = nodeLocations.get(currentKey)!;
        const nextCoordsList = exploreNode(drawnGraph, currentCoords);
        //console.log(`Found ${nextCoordsList.length} next nodes from (${currentCoords.x}, ${currentCoords.y})`);
        for (const nextCoords of nextCoordsList) {
            const nextKey = `${nextCoords.x},${nextCoords.y}`;
            let nextNode = nodeLocations.get(nextKey);
            if (!nextNode) {
                nextNode = {
                    parents: [currentNode],
                    children: [],
                };
                nodeLocations.set(nextKey, nextNode);
                frontier.push(nextCoords);
            } else {
                nextNode.parents.push(currentNode);
            }
            currentNode.children.push(nextNode);
        }
    }
    console.log(`Graph built with ${nodeLocations.size} nodes.`);
    return nodeLocations.get(`${startCoords.x},${startCoords.y}`)!;
}

export const collectAllPaths = (startNode: Node): number => {
    const savedPaths: Map<Node, number> = new Map();
    
    const gatherPathsFrom = (currentNode: Node): number => {
        if (currentNode.children.length === 0) {
            return 1;
        }
        if (savedPaths.has(currentNode)) {
            return savedPaths.get(currentNode)!;
        }
        let total = 0;
        for (const child of currentNode.children) {
            total += gatherPathsFrom(child);
            
        }
        savedPaths.set(currentNode, total);
        return total;
    }

    return gatherPathsFrom(startNode);
}


export const part1 = (input: string[]): number => {
    const {output, totalSplits} = propagateBeams(input);
    return totalSplits;
};

export const part2 = (input: string[]): number => {
    const paths = collectAllPaths(buildGraph(input));
    return paths;
};
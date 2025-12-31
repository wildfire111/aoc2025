import { count } from "console";
import * as path from "path";

export const day11 = (input: string[]) => {
    const part1Result: number = part1(input);
    const part2Result: number = part2(input);
    return { part1: part1Result, part2: part2Result};
};

export const parseInput = (input: string[]): Map<string,string[]> => {
    const nodeMap: Map<string,string[]> = new Map();
    for (const line of input){
        const [key, values] = line.split(":").map(s => s.trim());
        if (!values || !key) {continue;}
        const childNodes = values.split(" ");
        nodeMap.set(key, childNodes);
    }
    return nodeMap;
};
export const countAllPaths = (nodeMap: Map<string,string[]>, startNode: string, endNode: string): Set<string>[] => {
    
    const paths: Set<string>[] = [];
    type queueEntry = [string, Set<string>]; //node plus path to get there
    const queue: queueEntry[] = [[startNode, new Set()]];
    let counter = 0;
    while (queue.length > 0){
        counter++;
        if (counter % 1000 === 0){
            console.log(`Explored ${counter} nodes, queue length: ${queue.length}, paths found: ${paths.length}`);
        }
        const [currentNode, visitedNodes] = queue.pop()!;
        if (currentNode === endNode){
            const fullPath = new Set(visitedNodes).add(currentNode);
            paths.push(fullPath);
            continue;
        }
        if (visitedNodes.has(currentNode)){console.log("LOOP"); continue;} //avoid cycles

        if (!currentNode || !visitedNodes) {continue;}
        const neighbours = nodeMap.get(currentNode);
        if (!neighbours) {continue;}
        for (const neighbour of neighbours!){
            queue.push([neighbour, new Set([...visitedNodes, currentNode])]);
        }
    }
    return paths;
};

export const topologicalSort = (nodeMap: Map<string,string[]>): string[] => {
    const inDegree: Map<string, number> = new Map();
    for (const [node, neighbours] of nodeMap.entries()){
        if (!inDegree.has(node)){ //ensure all nodes are in the inDegree map
            inDegree.set(node, 0);
        }
        for (const neighbour of neighbours){ //count in-degrees
            inDegree.set(neighbour, (inDegree.get(neighbour) || 0) + 1);
        }
    }
    const zeroInDegreeQueue: string[] = [];
    for (const [node, degree] of inDegree.entries()){
        if (degree === 0){
            zeroInDegreeQueue.push(node);
        }
    }
    const sortedNodes: string[] = [];
    while (zeroInDegreeQueue.length > 0){
        const currentNode = zeroInDegreeQueue.shift()!;
        sortedNodes.push(currentNode);
        const neighbours = nodeMap.get(currentNode) || [];
        for (const neighbour of neighbours){
            inDegree.set(neighbour, inDegree.get(neighbour)! - 1);
            if (inDegree.get(neighbour) === 0){
                zeroInDegreeQueue.push(neighbour);
            }
        }
    }
    if (sortedNodes.length !== inDegree.size) {
        throw new Error("Graph has at least one cycle, topological sort not possible");
}

    return sortedNodes;
};

export const countPathsBetweenNodesTopoSorted = (nodeMap: Map<string,string[]>, startNode: string, endNode: string): number => {
    const sortedNodes = topologicalSort(nodeMap);
    const pathCounts: Map<string, number> = new Map();
    for (const node of sortedNodes){
        pathCounts.set(node, 0);
    }
    pathCounts.set(startNode, 1); //one way to reach start node

    for (const node of sortedNodes){
        const currentCount = pathCounts.get(node)!;
        const neighbours = nodeMap.get(node) || [];
        for (const neighbour of neighbours){
            pathCounts.set(neighbour, pathCounts.get(neighbour)! + currentCount);
        }
    }
    return pathCounts.get(endNode)!;
};

export const dropNodesThatCannotReachStartOrEnd = (
    nodeMap: Map<string,string[]>, 
    startNode: string, endNode: string): 
    Map<string,string[]> => {
    // Find nodes reachable from startNode
    const reachableFromStart: Set<string> = new Set();
    const stack: string[] = [startNode];
    while (stack.length > 0){
        const currentNode = stack.pop()!;
        if (!reachableFromStart.has(currentNode)){
            reachableFromStart.add(currentNode);
            const neighbours = nodeMap.get(currentNode) || [];
            for (const neighbour of neighbours){
                stack.push(neighbour);
            }
        }
    }

    // Find nodes that can reach endNode (reverse graph traversal)
    const canReachEnd: Set<string> = new Set();
    const reverseStack: string[] = [endNode];
    const reverseMap: Map<string, string[]> = new Map();
    for (const [node, neighbours] of nodeMap.entries()){
        for (const neighbour of neighbours){
            if (!reverseMap.has(neighbour)){
                reverseMap.set(neighbour, []);
            }
            reverseMap.get(neighbour)!.push(node);
        }
    }
    while (reverseStack.length > 0){
        const currentNode = reverseStack.pop()!;
        if (!canReachEnd.has(currentNode)){
            canReachEnd.add(currentNode);
            const neighbours = reverseMap.get(currentNode) || [];
            for (const neighbour of neighbours){
                reverseStack.push(neighbour);
            }
        }
    }

    // Build the filtered node map
    const filteredNodeMap: Map<string, string[]> = new Map();
    for (const node of nodeMap.keys()){
        if (reachableFromStart.has(node) && canReachEnd.has(node)){
            filteredNodeMap.set(node, nodeMap.get(node)!);
        }
    }
    console.log(`Reduced node map from ${nodeMap.size} to ${filteredNodeMap.size} nodes`);
    return filteredNodeMap;
};

export const countAllPathsIncludingNodes = (nodeMap: Map<string,string[]>, startNode: string, endNode: string, includedNodes: Set<string>): number => {
    
    let pathCount: number = 0;
    type queueEntry = [string, Set<string>]; //node plus path to get there
    const queue: queueEntry[] = [[startNode, new Set()]];
    let counter = 0;
    while (queue.length > 0){
        counter++;
        if (counter % 10000 === 0){
            console.log(`Explored ${counter} nodes, queue length: ${queue.length}, paths found: ${pathCount}`);
        }
        const [currentNode, visitedNodes] = queue.pop()!;
        if (currentNode === endNode){
            const fullPath = new Set(visitedNodes).add(currentNode);
            let includesAll = true;
            for (const includedNode of includedNodes){
                if (!fullPath.has(includedNode)){
                    includesAll = false;
                    break;
                }
            }
            if (includesAll) {
                pathCount++;
            }
            continue;
        }
        if (visitedNodes.has(currentNode)){console.log("LOOP"); continue;} //avoid cycles

        if (!currentNode || !visitedNodes) {continue;}
        const neighbours = nodeMap.get(currentNode);
        if (!neighbours) {continue;}
        for (const neighbour of neighbours!){
            queue.push([neighbour, new Set([...visitedNodes, currentNode])]);
        }
    }
    return pathCount;
};




export const part1 = (input: string[]): number => {
    const nodeMap = parseInput(input);
    const paths = countAllPaths(nodeMap, "you", "out");
    return paths.length;
}

const part2 = (input: string[]): number => {
    const nodeMap = parseInput(input);
    const filteredNodeMap = dropNodesThatCannotReachStartOrEnd(nodeMap, "svr", "out");
    const svrToFft = countPathsBetweenNodesTopoSorted(filteredNodeMap, "svr", "fft");
    console.log(`svr to fft paths: ${svrToFft}`);
    const svrToDac = countPathsBetweenNodesTopoSorted(filteredNodeMap, "svr", "dac");
    console.log(`svr to dac paths: ${svrToDac}`);
    const fftToDac = countPathsBetweenNodesTopoSorted(filteredNodeMap, "fft", "dac");
    console.log(`fft to dac paths: ${fftToDac}`);
    const dacToOut = countPathsBetweenNodesTopoSorted(filteredNodeMap, "dac", "out");
    console.log(`dac to out paths: ${dacToOut}`);
    const fftToOut = countPathsBetweenNodesTopoSorted(filteredNodeMap, "fft", "out");
    console.log(`fft to out paths: ${fftToOut}`);
    const dacToFft = countPathsBetweenNodesTopoSorted(filteredNodeMap, "dac", "fft");
    console.log(`dac to fft paths: ${dacToFft}`);
    const svrFftDacOut = svrToFft * fftToDac * dacToOut;
    const svrDacFftOut = svrToDac * dacToFft * fftToOut;
    return svrFftDacOut + svrDacFftOut;

    return paths;
}
import { buildGrid } from "../day4/day4";

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

const buildGrid = (coords: Coord[], cols: number, rows: number): string[][] => {

    const grid: string[][] = Array.from({ length: rows }, () => Array(cols).fill('.'))
    
    

export const part1 = (input: string[]): number => {
    const coords = parseInput(input);
    const result = findBiggestArea(coords);
    return result.biggestArea;
};

export const part2 = (input: string[]): number => {
    return 0;
};
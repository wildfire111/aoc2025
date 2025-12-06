export const day4 = (input: string[]) => {
    const part1Result: number = part1(input);
    const part2Result: number = part2(input);
    return { part1: part1Result, part2: part2Result};
};

export const buildGrid = (input: string[]): string[][] => {
    const grid: string[][] = [];
    for (const line of input) {
        grid.push(line.split(""));
    }
    return grid;
};

export const isAccessible = (grid: string[][], row: number, col: number): boolean => {
    const coordOffsets: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
    let rolls = 0;
    for (const [plusY, plusX] of coordOffsets) {
        if (hasRoll(grid, row + plusY, col + plusX)) {
            rolls++;
            console.log(`${row}, ${col} has roll at ${row + plusY}, ${col + plusX}. Total rolls: ${rolls}`);
        } else {
            console.log(`${row}, ${col} has NO roll at ${row + plusY}, ${col + plusX}. Total rolls: ${rolls}`);
        }
        if (rolls >= 4) {
            return false;
        }
    }
    return true;
};

    
export const hasRoll = (grid: string[][], row: number, col: number): boolean => {
    const numRows = grid.length;
    if (grid[0] === undefined || grid[0][0] === undefined) {
        throw new Error("Grid construction error.");
    }
    const numCols = grid[0].length;
    if (row < 0 || row >= numRows || col < 0 || col >= numCols) {
        console.log(`hasRoll: (${row}, ${col}) is out of bounds, hasRoll = false`);
        return false;
        
    }
    if(!grid[row]) return false;
    console.log(`hasRoll: (${row}, ${col}) is ${grid[row][col]}, hasRoll = ${grid[row][col] === "@"}`);
    return grid[row][col] === "@";
};

export const markXAccessible = (grid: string[][]): string[][] => {
    const newGrid = grid.map(r => Array(r.length).fill(""));
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0]!.length; c++) {
            if (isAccessible(grid, r, c) && hasRoll(grid, r, c)) {
                newGrid[r]![c] = "x";
            } else {
                newGrid[r]![c] = grid[r]![c];
            }
        }
    }
    return newGrid;
};


export const part1 = (input: string[]): number => {
    return 0;
};

export const part2 = (input: string[]): number => {
    return 0;
};
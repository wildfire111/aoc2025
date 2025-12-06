import * as day4 from "./day4.js";

let input: string[][];
let part1example: string[][];

beforeEach(() => {
    const inputString = 
`..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`
    input = day4.buildGrid(inputString.split("\n"));
    const part1exampleString =
`..xx.xx@x.
x@@.@.@.@@
@@@@@.x.@@
@.@@@@..@.
x@.@@@@.@x
.@@@@@@@.@
.@.@.@.@@@
x.@@@.@@@@
.@@@@@@@@.
x.x.@@@.x.`;
    part1example = day4.buildGrid(part1exampleString.split("\n"));
});

describe("hasRoll", () => {
    it("correctly identifies rolls", () => {
        let grid = day4.buildGrid(["..",".."]);
        expect(day4.hasRoll(grid, 0, 0)).toBe(false);
        grid = day4.buildGrid(["@@","@."]);
        expect(day4.hasRoll(grid, 0, 0)).toBe(true);
        expect(day4.hasRoll(grid, -1, 0)).toBe(false);
        expect(day4.hasRoll(grid, 0, -1)).toBe(false);
        expect(day4.hasRoll(grid, 2, 0)).toBe(false);
        expect(day4.hasRoll(grid, 0, 2)).toBe(false);
        expect(day4.hasRoll(input, 0, 0)).toBe(false);
        expect(day4.hasRoll(input, 3, 3)).toBe(true);
        expect(day4.hasRoll(input, -1, 0)).toBe(false);
        expect(day4.hasRoll(input, 1, 1)).toBe(true);
        expect(day4.hasRoll(input, 3, 1)).toBe(false);
        expect(day4.hasRoll(input, 2, 1)).toBe(true);
    });
});

describe("isAccessible", () => {
    it("correctly identifies accessible seats", () => {
        expect(day4.isAccessible(input, 0, 2)).toBe(true);
        expect(day4.isAccessible(input, 0, 3)).toBe(true);
        expect(day4.isAccessible(input, 1, 0)).toBe(true);
        expect(day4.isAccessible(input, 2, 6)).toBe(true);
        expect(day4.isAccessible(input, 4, 9)).toBe(true);
        expect(day4.isAccessible(input, 2, 0)).toBe(false);
        expect(day4.isAccessible(input, 3, 0)).toBe(false);
        expect(day4.isAccessible(input, 5, 9)).toBe(false);
    });
});

describe("markXAccessible", () => {
    it("correctly marks accessible seats with X", () => {
        const markedGrid = day4.markXAccessible(input);
        console.log(markedGrid.map(r => r.join("")).join("\n"));
        console.log("----");
        console.log(part1example.map(r => r.join("")).join("\n"));
        expect(markedGrid).toEqual(part1example);
    });
});
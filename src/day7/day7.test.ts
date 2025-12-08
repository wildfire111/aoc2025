import { start } from "repl";
import * as day7 from "./day7.js";

let input: string[] = [];

beforeEach(() => {
    input = `.......S.......
.......|.......
......|^|......
......|.|......
.....|^|^|.....
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`.split("\n");
    
});

describe("getChar", () => {
    test("gets correct character within bounds", () => {
        expect(day7.getChar(input, {x: 7, y: 0})).toBe("S");
        expect(day7.getChar(input, {x: 7, y: 1})).toBe("|");
        expect(day7.getChar(input, {x: 6, y: 2})).toBe("|");
        expect(day7.getChar(input, {x: 0, y: 15})).toBe(".");
    });
    test("returns ? for out of bounds", () => {
        expect(day7.getChar(input, {x: -1, y: 0})).toBe("?");
        expect(day7.getChar(input, {x: 0, y: -1})).toBe("?");
        expect(day7.getChar(input, {x: 100, y: 0})).toBe("?");
        expect(day7.getChar(input, {x: 0, y: 100})).toBe("?");
    });
});

describe("isSplitterAndShouldSplit", () => {
    test("identifies splits correctly", () => {
        expect(day7.isSplitterAndShouldSplit(input, {x: 6, y: 4})).toBe(true);
        expect(day7.isSplitterAndShouldSplit(input, {x: 8, y: 4})).toBe(true);
    });
    test("identifies non-splits correctly", () => {
        expect(day7.isSplitterAndShouldSplit(input, {x: 0, y: 0})).toBe(false);
        expect(day7.isSplitterAndShouldSplit(input, {x: 1, y: 14})).toBe(false);
        expect(day7.isSplitterAndShouldSplit(input, {x: 5, y: 5})).toBe(false);
    });
});

describe("splitAt", () => {
    test("splits correctly when both sides are .", () => {
        const test1 = ".^.";
        const {input: resultInput, splitCount} = day7.splitAt([test1], {x: 1, y: 0});
        expect(resultInput[0]).toBe("|^|");
        expect(splitCount).toBe(1);
    });
    test("splits correctly when only right side is eligible", () => {
        const test2 = "^.";
        const {input: resultInput, splitCount} = day7.splitAt([test2], {x: 0, y: 0});
        expect(resultInput[0]).toBe("^|");
        expect(splitCount).toBe(1);
    });
    test("splits correctly when only left side is eligible", () => {
        const test3 = ".^^";
        const {input: resultInput, splitCount} = day7.splitAt([test3], {x: 1, y: 0});
        expect(resultInput[0]).toBe("|^^");
        expect(splitCount).toBe(1);
    });
    test("does not split when neither side is eligible", () => {
        const test4 = "^^^";
        const {input: resultInput, splitCount} = day7.splitAt([test4], {x: 1, y: 0});
        expect(resultInput[0]).toBe("^^^");
        expect(splitCount).toBe(0);
    });
});

describe("replaceChar", () => {
    test("replaces character correctly within bounds", () => {
        let testInput = [".....", "..S..", "....."];
        testInput = day7.replaceChar(testInput, {x: 2, y: 1}, "X");
        expect(testInput[1]).toBe("..X..");
    });
    test("does not modify input when out of bounds", () => {
        let testInput = [".....", "..S..", "....."];
        const result1 = day7.replaceChar(testInput, {x: -1, y: 1}, "X");
        expect(result1).toEqual(testInput);
        const result2 = day7.replaceChar(testInput, {x: 2, y: -1}, "X");
        expect(result2).toEqual(testInput);
        const result3 = day7.replaceChar(testInput, {x: 5, y: 1}, "X");
        expect(result3).toEqual(testInput);
        const result4 = day7.replaceChar(testInput, {x: 2, y: 3}, "X");
        expect(result4).toEqual(testInput);
    });
});

describe("propagateBeams", () => {
    test("propagates beams correctly", () => {
        const result = day7.propagateBeams(input);
        const expected = `.......S.......
.......|.......
......|^|......
......|.|......
.....|^|^|.....
.....|.|.|.....
....|^|^|^|....
....|.|.|.|....
...|^|^|||^|...
...|.|.|||.|...
..|^|^|||^|^|..
..|.|.|||.|.|..
.|^|||^||.||^|.
.|.|||.||.||.|.
|^|^|^|^|^|||^|
|.|.|.|.|.|||.|`.split("\n");
        expect(result.output).toEqual(expected);
        expect(result.totalSplits).toBe(18);
    });
});

describe("quantumSplit", () => {
    test("explores splits correctly", () => {
        const finishedGraph = `.......S.......
.......|.......
......|^|......`.split("\n");
        const splits = day7.quantumPaths(finishedGraph, {x: 7, y: 0}, 0);
        expect(splits).toBe(2);
    });
    test("handles out of bounds correctly", () => {
        const finishedGraph = `.......S.......
.......|.......
......|^|......`.split("\n");
        const splits = day7.quantumPaths(finishedGraph, {x: 100, y: 100}, 0);
        expect(splits).toBe(0);
    });
    test("handles example case correctly", () => {
        const finishedGraph = day7.propagateBeams(input).output;
        const paths = day7.quantumPaths(finishedGraph, {x: 7, y: 0}, 0);
        expect(paths).toBe(40);
    });
});

describe("buildGraph", () => {
    test("makes the correct number of nodes", () => {
        const input1 = `.S.
.|.
|^|`.split("\n");
        const start = day7.buildGraph(input1);
        expect(start.children.length).toBe(1);
        console.log(start.children)
        expect(start.children[0]!.children.length).toBe(1);
        expect(start.children[0]!.children[0]!.children.length).toBe(2);
        expect(start.children[0]!.children[0]!.children[0]!.children.length).toBe(1);
        expect(start.children[0]!.children[0]!.children[1]!.children.length).toBe(1);
    });
});

describe("gatherAllPaths", () => {
    test("counts paths correctly in simple graph", () => {
        const input1 = `.S.
.|.
|^|`.split("\n");
        const start = day7.buildGraph(input1);
        const pathCount = day7.collectAllPaths(start);
        expect(pathCount).toBe(2);
    });
    test("counts paths correctly in example graph", () => {
        const start = day7.buildGraph(input);
        const pathCount = day7.collectAllPaths(start);
        expect(pathCount).toBe(40);
    });
});







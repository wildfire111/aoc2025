import * as day5 from "./day5.js";

let parsedInput: {ranges: [number, number][], numbers: number[]};


beforeEach(() => {
    const inputString = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;
    const input = inputString.split("\n");
    parsedInput = day5.parseInput(input);

});

describe("checkNumInRanges", () => {
    test("number within a range", () => {
        expect(day5.checkNumInRanges(4, parsedInput.ranges)).toBe(true);
        expect(day5.checkNumInRanges(10, parsedInput.ranges)).toBe(true);
        expect(day5.checkNumInRanges(15, parsedInput.ranges)).toBe(true);
        expect(day5.checkNumInRanges(18, parsedInput.ranges)).toBe(true);
    });

    test("number outside all ranges", () => {
        expect(day5.checkNumInRanges(2, parsedInput.ranges)).toBe(false);
        expect(day5.checkNumInRanges(9, parsedInput.ranges)).toBe(false);
        expect(day5.checkNumInRanges(21, parsedInput.ranges)).toBe(false);
        expect(day5.checkNumInRanges(50, parsedInput.ranges)).toBe(false);
    });
});

describe("condenseRanges", () => {
    test("condenses overlapping and adjacent ranges", () => {
        let testRanges: [number, number][] = [[1,2]];
        expect(day5.condenseRanges(testRanges)).toEqual([[1,2]]);

        testRanges = [[1,3],[2,4]];
        expect(day5.condenseRanges(testRanges)).toEqual([[1,4]]);

        testRanges = [[2,4],[1,3]];
        expect(day5.condenseRanges(testRanges)).toEqual([[1,4]]);

        testRanges = [[1,2],[3,4],[5,6]];
        expect(day5.condenseRanges(testRanges)).toEqual([[1,2],[3,4],[5,6]]);

        testRanges = [[1,5],[2,6],[8,10],[9,12]];
        expect(day5.condenseRanges(testRanges)).toEqual([[1,6],[8,12]]);

        testRanges = [[5,7],[1,3],[2,6],[8,10],[15,18],[17,20]];
        expect(day5.condenseRanges(testRanges)).toEqual([[1,7],[8,10],[15,20]]);
    });
    test("works on example input", () => {
        expect(day5.condenseRanges(parsedInput.ranges)).toEqual([[3,5],[10,20]]);
    });
});




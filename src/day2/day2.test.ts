import { part1, part2, halveString, parseInput, getInvalidIDsP1, getInvalidIDsP2 } from "./day2.js";

type Range = [number, number];
let input: [Range, Range, Range, Range, Range, Range, Range, Range, Range, Range, Range];

beforeAll(() => {
    const unparsedInput: [string, string, string, string, string, string, string, string, string, string, string] = [
            "11-22",
            "95-115",
            "998-1012",
            "1188511880-1188511890",
            "222220-222224",
            "1698522-1698528",
            "446443-446449",
            "38593856-38593862",
            "565653-565659",
            "824824821-824824827",
            "2121212118-2121212124"
    ];
    input = unparsedInput.map(parseInput) as unknown as [Range, Range, Range, Range, Range, Range, Range, Range, Range, Range, Range];

});

describe("Halve String", () => {
    it("halves strings correctly", () => {
        expect(halveString("1234")).toEqual(["12", "34"]);
        expect(halveString("123456")).toEqual(["123", "456"]);
    });
});


describe("getInvalidIDsP1", () => {
    it("returns the correct invalid IDs", () => {
        const result1 = getInvalidIDsP1(input[0]);
        expect(result1).toEqual([11, 22]);
        const result2 = getInvalidIDsP1(input[1]);
        expect(result2).toEqual([99]);
        const result3 = getInvalidIDsP1(input[2]);
        expect(result3).toEqual([1010]);
        const result4 = getInvalidIDsP1(input[3]);
        expect(result4).toEqual([1188511885]);
        const result5 = getInvalidIDsP1(input[4]);
        expect(result5).toEqual([222222]);
        const result6 = getInvalidIDsP1(input[5]);
        expect(result6).toEqual([]);
        const result7 = getInvalidIDsP1(input[6]);
        expect(result7).toEqual([446446]);
        const result8 = getInvalidIDsP1(input[7]);
        expect(result8).toEqual([38593859]);
        const result9 = getInvalidIDsP1(input[8]);
        expect(result9).toEqual([]);
        const result10 = getInvalidIDsP1(input[9]);
        expect(result10).toEqual([]);
        const result11 = getInvalidIDsP1(input[10]);
        expect(result11).toEqual([]);
    });
});

describe("part1", () => {
    it("calculates part1 correctly", () => {
        const result = part1(input);
        expect(result).toEqual(1227775554);
    });
});

describe("getInvalidIDsP2", () => {
    it("matches example cases", () => {
        const invalidIds: number[][] = [
            [11, 22],
            [99, 111],
            [999, 1010],
            [1188511885],
            [222222],
            [],
            [446446],
            [38593859],
            [565656],
            [824824824],
            [2121212121]
            ];

        for (let i = 0; i < input.length; i++) {
            const result = getInvalidIDsP2(input[i]!);
            expect(result).toEqual(invalidIds[i]);
        }
    });
});

describe("part2", () => {
    it("calculates part2 correctly", () => {
        const result = part2(input);
        expect(result).toEqual(4174379265);
    });
});
import * as day3 from "./day3.js";

let input: string[];

beforeEach(() => {
    input = `987654321111111
811111111111119
234234234234278
818181911112111`.split("\n");
});

describe("getMaxJoltage", () => {
    it("returns correct max joltage", () => {
        expect(() => day3.getMaxJoltage("")).toThrowError("Array must contain at least two elements.");
        expect(() => day3.getMaxJoltage("5")).toThrowError("Array must contain at least two elements.");
        expect(day3.getMaxJoltage("21")).toEqual(21);
        expect(day3.getMaxJoltage("34")).toEqual(34);
        expect(day3.getMaxJoltage("12345")).toEqual(45);
        expect(day3.getMaxJoltage("1254321")).toEqual(54);
        expect(day3.getMaxJoltage("1254325")).toEqual(55);
        expect(day3.getMaxJoltage("9876543210")).toEqual(98);
    });
});
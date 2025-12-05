import { day1, turn, getHits} from "./day1.js";

let input: string[];

beforeAll(() => {
    input = ["L68","L30","R48","L5","R60","L55","L1","L99","R14","L82"]
});

describe("turn", () => {
    it("moves correctly", () => {
        expect(turn(0,10)).toEqual(10);
        expect(turn(95,10)).toEqual(5);
        expect(turn(5,-10)).toEqual(95);
        expect(turn(50,1000)).toEqual(50);
        expect(turn(50,-1000)).toEqual(50);
        expect(turn(50,9999)).toEqual(49);
        expect(turn(50,-9999)).toEqual(51);
    });
});


describe("part1", () => {
    it("counts zero correctly", () => {
        const result = day1(["L50"]).part1;
        expect(result).toEqual(1);
    });
    it("returns the correct result on the example", () => {
        const result = day1(input).part1;
        expect(result).toEqual(3);
    });
});

describe("getHits", () => {
    it("calculates hits correctly", () => {
        expect(getHits(50,0)).toEqual(0);
        expect(getHits(50,49)).toEqual(0);
        expect(getHits(50,50)).toEqual(1);
        expect(getHits(50,100)).toEqual(1);
        expect(getHits(50,150)).toEqual(2);
        expect(getHits(50,250)).toEqual(3);
        expect(getHits(50,-49)).toEqual(0);
        expect(getHits(50,-50)).toEqual(1);
        expect(getHits(50,-100)).toEqual(1);
        expect(getHits(50,-150)).toEqual(2);
        expect(getHits(50,-250)).toEqual(3);
    });
});

describe("part2", () => {
    it("returns the correct result on the example", () => {
        const result = day1(input).part2;
        expect(result).toEqual(6);
    });
});
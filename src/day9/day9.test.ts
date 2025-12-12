import * as day9 from "./day9.js";

let input: string[] = [];

beforeEach(() => {
    input = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`.split("\n");
    const parsedInput = day9.parseInput(input);
    
});

describe("calculate area between coordinates", () => {
    it("calculates area between two coordinates in a line", () => {
        const coordA: day9.Coord = { x: 1, y: 1 };
        const coordB: day9.Coord = { x: 2, y: 1 };
        const area = day9.areaBetweenCoords({ coordA, coordB });
        expect(area).toBe(2);
    });
    it("calculates area between two coordinates in a column", () => {
        const coordA: day9.Coord = { x: 1, y: 1 };
        const coordB: day9.Coord = { x: 1, y: 3 };
        const area = day9.areaBetweenCoords({ coordA, coordB });
        expect(area).toBe(3);
    });
    it("calculates area between two coordinates in a rectangle", () => {
        const coordA: day9.Coord = { x: 1, y: 1 };
        const coordB: day9.Coord = { x: 3, y: 4 };
        const area = day9.areaBetweenCoords({ coordA, coordB });
        expect(area).toBe(12);
    });
});

describe("find biggest area between coordinates", () => {
    it("finds the biggest area between multiple coordinates", () => {
        const coords: day9.Coord[] = [
            { x: 1, y: 1 },
            { x: 1, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 2 },
        ];
        const result = day9.findBiggestArea(coords);
        expect(result.biggestArea).toBe(4);
        expect(result.coordA).toEqual({ x: 1, y: 1 });
        expect(result.coordB).toEqual({ x: 2, y: 2 });
    });
    it("works correctly on example input", () => {
        const coords = day9.parseInput(input);
        const result = day9.findBiggestArea(coords);
        expect(result.biggestArea).toBe(50);
        expect(result.coordA).toBeOneOf([{ x: 2, y: 5 }, { x: 11, y: 1 }]);
        expect(result.coordB).toBeOneOf([{ x: 2, y: 5 }, { x: 11, y: 1 }]);
    });
});

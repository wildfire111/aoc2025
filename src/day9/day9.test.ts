import * as day9 from "./day9.js";

let input: string[] = [];
let parsedInput: day9.Coord[] = [];

beforeEach(() => {
    input = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`.split("\n");
    parsedInput = day9.parseInput(input);
    
});

describe("areaBetweenCoords", () => {
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

describe("findBiggestArea", () => {
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




describe("buildIntersectionsMap", () => {
    it("builds intersection maps for a rectangle", () => {
        const coords: day9.Coord[] = [
            { x: 1, y: 1 },
            { x: 1, y: 3 },
            { x: 4, y: 3 },
            { x: 4, y: 1 },
        ];
        day9.printGrid(coords);
        const maps = day9.buildIntersectMap(coords);
        console.log("Intersects on X axis:");
        console.table([...maps.intersectsOnX.entries()].map(([YLevel , intersects]) => ({ YLevel , intersects })));
    });
    it("builds map for example input", () => {
        const coords = day9.parseInput(input);
        day9.printGrid(coords);
        const maps = day9.buildIntersectMap(coords);
        console.log("Intersects on X axis:");
        console.table([...maps.intersectsOnX.entries()].map(([YLevel , intersects]) => ({ YLevel , intersects })));
    });
});



describe("isPointInShape", () => {
    it("determines if point is inside shape", () => {
        const shapeCorners: day9.Coord[] = [
            { x: 1, y: 1 },
            { x: 1, y: 4 },
            { x: 4, y: 4 },
            { x: 4, y: 1 },
        ];
        const maps = day9.buildIntersectMap(shapeCorners);
        const insidePoint: day9.Coord = { x: 2, y: 2 };
        const outsidePoint: day9.Coord = { x: 0, y: 0 };
        expect(day9.isPointInShape(insidePoint, maps)).toBe(true);
        expect(day9.isPointInShape(outsidePoint, maps)).toBe(false);
    });
    it("determines if point is inside complex shape from example input", () => {
        const shapeCorners = day9.parseInput(input);
        day9.printGrid(shapeCorners);
        const intersectsOnX = day9.buildIntersectMap(shapeCorners);
        console.log(`Testing coord ${JSON.stringify({x: 2, y: 3})}`);
        expect(day9.isPointInShape({x: 2, y: 3}, intersectsOnX)).toBe(true);
        console.log(`Testing coord ${JSON.stringify({x: 2, y: 4})}`);
        expect(day9.isPointInShape({x: 2, y: 5}, intersectsOnX)).toBe(true);
        console.log(`Testing coord ${JSON.stringify({x: 6, y: 4})}`);
        expect(day9.isPointInShape({x: 6, y: 4}, intersectsOnX)).toBe(true);
        console.log(`Testing coord ${JSON.stringify({x: 11, y: 6})}`);
        expect(day9.isPointInShape({x: 11, y: 6}, intersectsOnX)).toBe(true);
        console.log(`Testing coord ${JSON.stringify({x: 10, y: 4})}`);
        expect(day9.isPointInShape({x: 10, y: 4}, intersectsOnX)).toBe(true);
        console.log(`Testing coord ${JSON.stringify({x: 9, y: 3})}`);
        expect(day9.isPointInShape({x: 9, y: 3}, intersectsOnX)).toBe(true);
        console.log(`Testing coord ${JSON.stringify({x: 6, y: 1})}`);
        expect(day9.isPointInShape({x: 6, y: 1}, intersectsOnX)).toBe(false);
        console.log(`Testing coord ${JSON.stringify({x: 6, y: 2})}`);
        expect(day9.isPointInShape({x: 2, y: 4}, intersectsOnX)).toBe(true);
        console.log(`Testing coord ${JSON.stringify({x: 8, y: 6})}`);
        expect(day9.isPointInShape({x: 8, y: 6}, intersectsOnX)).toBe(false);
        console.log(`Testing coord ${JSON.stringify({x: 12, y: 6})}`);
        expect(day9.isPointInShape({x: 12, y: 6}, intersectsOnX)).toBe(false);
    });
});

describe("isRectangleInsideShape", () => {
    it("determines if rectangle is inside shape", () => {
        const shapeCorners: day9.Coord[] = [
            { x: 1, y: 1 },
            { x: 1, y: 4 },
            { x: 4, y: 4 },
            { x: 4, y: 1 },
        ];
        const maps = day9.buildIntersectMap(shapeCorners);
        const insideRectA: day9.Coord = { x: 2, y: 2 };
        const insideRectB: day9.Coord = { x: 3, y: 3 };
        const outsideRectA: day9.Coord = { x: 0, y: 0 };
        const outsideRectB: day9.Coord = { x: 2, y: 2 };
        expect(day9.isRectangleInsideShape(insideRectA, insideRectB, maps)).toBe(true);
        expect(day9.isRectangleInsideShape(outsideRectA, outsideRectB, maps)).toBe(false);
    });
    it("determines if rectangle is inside complex shape from example input", () => {
        const shapeCorners = day9.parseInput(input);
        day9.printGrid(shapeCorners);
    const maps = day9.buildIntersectMap(shapeCorners);
        expect(day9.isRectangleInsideShape({ x: 2, y: 3 }, { x: 9, y: 5 }, maps)).toBe(true);
        expect(day9.isRectangleInsideShape({ x: 11, y: 1 }, { x: 2, y: 3 }, maps)).toBe(false);
        expect(day9.isRectangleInsideShape({ x: 9, y: 7 }, { x: 11, y: 1 }, maps)).toBe(true);
    });
});

describe("findBiggestRectangleInsideShape", () => {
    it("finds biggest rectangle inside shape for example input", () => {
        const shapeCorners = day9.parseInput(input);
        day9.printGrid(shapeCorners);
        const intersectsOnX = day9.buildIntersectMap(shapeCorners);
        
        const result = day9.findBiggestRectangleInsideShape(shapeCorners, intersectsOnX);
        console.log(`Biggest rectangle inside shape has area ${result.area} between ${JSON.stringify(result.coordA)} and ${JSON.stringify(result.coordB)}`);
        expect(result.area).toBe(24);
        expect(result.coordA).toBeOneOf([{ x: 2, y: 3 }, { x: 9, y: 5 }]);
        expect(result.coordB).toBeOneOf([{ x: 2, y: 3 }, { x: 9, y: 5 }]);
    });
});


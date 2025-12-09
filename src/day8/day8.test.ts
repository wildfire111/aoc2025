import * as day8 from "./day8.js";

let input: day8.Coord[] = [];

beforeEach(() => {
    input = day8.parseInput(`162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`.split("\n"));
});
describe("getClosestPair", () => {
    test("correctly finds closest pair of coordinates", () => {
        const [coordA, coordB] = day8.findClosestPair(input);
        expect(coordA).toEqual({x: 162, y: 817, z: 812});
        expect(coordB).toEqual({x: 425, y: 690, z: 689});
    });
});

describe("buildDistanceList", () => {
    test("correctly builds and sorts distance list", () => {
        const distanceList = day8.buildDistanceList(input);
        const {coordA, coordB} = distanceList[distanceList.length - 1]!;
        expect(coordA).toEqual({x: 162, y: 817, z: 812});
        expect(coordB).toEqual({x: 425, y: 690, z: 689});
        const {coordA: coordA2, coordB: coordB2} = distanceList[distanceList.length - 2]!;
        expect(coordA2).toEqual({x: 162, y: 817, z: 812});
        expect(coordB2).toEqual({x: 431, y: 825, z: 988});
    });
});

describe("buildCircuits", () => {
    test("correctly builds circuits with given connections", () => {
        const circuits = day8.buildCircuits(input, 10);
        expect(circuits.length).toBe(11);
    });
});

describe("multiplyThreeBiggestCircuitSizes", () => {
    test("correctly multiplies sizes of circuits", () => {
        const circuits = day8.buildCircuits(input, 10);
        const product = day8.multiplyThreeBiggestCircuitSizes(circuits);
        expect(product).toBe(40);
    });
});

describe("connectUntilSingleCircuit", () => {
    test("return the correct coordinate pair", () => {
        const result = day8.connectUntilSingleCircuit(input);
        expect(result?.coordA).toEqual({x: 216, y: 146, z: 977});
        expect(result?.coordB).toEqual({x: 117, y: 168, z: 530});
    });
});

describe("multXCoordsOfLastConnection", () => {
    test("correctly multiplies x coordinates of last connection", () => {
        const lastConnection = day8.connectUntilSingleCircuit(input);
        const product = day8.multXCoordsOfLastConnection(lastConnection);
        expect(product).toBe(25272);
    });
});




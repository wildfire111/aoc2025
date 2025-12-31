import * as day11 from '../day11/day11';

describe("parseInput", () => {
    it("parses input into a node map", () => {
        const input = [
            "A: B C",
            "B: D",
            "C: D",
            "D: END"
        ];
        const nodeMap = day11.parseInput(input);
        expect(nodeMap.get("A")).toEqual(["B", "C"]);
        expect(nodeMap.get("B")).toEqual(["D"]);
        expect(nodeMap.get("C")).toEqual(["D"]);
        expect(nodeMap.get("D")).toEqual(["END"]);
    });
});

describe("countAllPaths", () => {
    it("counts all paths from start to end", () => {
        const input = [
            "A: B C",
            "B: D",
            "C: D",
            "D: END"
        ];
        const nodeMap = day11.parseInput(input);
        const pathCount = day11.countAllPaths(nodeMap, "A", "END");
        expect(pathCount).toBe(2);
    });
    it("returns 0 when there are no paths", () => {
        const input = [
            "A: B",
            "B: C",
            "C: D"
        ];
        const nodeMap = day11.parseInput(input);
        const pathCount = day11.countAllPaths(nodeMap, "A", "END");
        expect(pathCount).toBe(0);
    });
    it("correctly solves example", () => {
        const input = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`.split("\n");
        const nodeMap = day11.parseInput(input);
        const pathCount = day11.countAllPaths(nodeMap, "you", "out");
        expect(pathCount).toBe(5);
    });
});

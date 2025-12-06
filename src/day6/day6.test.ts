import * as day6 from "./day6.js";

let input: string[][] = [];

beforeEach(() => {
    input = day6.parseInput(`123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `.split("\n"));
});

describe("extractEquations", () => {
    test("correctly extracts equations from input", () => {
        const equations = day6.extractEquations(input);
        expect(equations).toEqual([
            {numarray: [123, 45, 6], operator: "*"},
            {numarray: [328, 64, 98], operator: "+"},
            {numarray: [51, 387, 215], operator: "*"},
            {numarray: [64, 23, 314], operator: "+"}
        ]);
    });
});

describe("solveEquation", () => {
    test("correctly solves multiplication equations", () => {
        const equation = {numarray: [2, 3, 4], operator: "*"};
        const result = day6.solveEquation(equation);
        expect(result).toBe(24);
    });
    
    test("correctly solves addition equations", () => {
        const equation = {numarray: [5, 10, 15], operator: "+"};
        const result = day6.solveEquation(equation);
        expect(result).toBe(30);
    });
    test("correctly solves example equations", () => {
        let equations = day6.extractEquations(input);
        let result = day6.solveEquation(equations[0]!);
        expect(result).toBe(123 * 45 * 6);
        result = day6.solveEquation(equations[1]!);
        expect(result).toBe(328 + 64 + 98);
        result = day6.solveEquation(equations[2]!);
        expect(result).toBe(51 * 387 * 215);
        result = day6.solveEquation(equations[3]!);
        expect(result).toBe(64 + 23 + 314);
    });
});

describe("sumEquations", () => {
    test("correctly sums solved equations", () => {
        const equations = day6.extractEquations(input);
        const sum = day6.sumEquations(equations);
        expect(sum).toBe(4277556);
    });
});

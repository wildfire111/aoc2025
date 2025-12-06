export const day6 = (input: string[]) => {
    const part1Result: number = part1(input);
    const part2Result: number = part2(input);
    return { part1: part1Result, part2: part2Result};
};

export const parseInput = (input: string[]): string[][] => {
    const parsedInput = input.map(line => line.trim().split(/ +/).filter(token => token.length > 0));
    return parsedInput;
};

export const extractEquations = (input2d: string[][]): {numarray: number[], operator: string}[] => {
    const operatorArray: string[] = input2d[input2d.length - 1] as string[];
    const numarray: number[][] = [];
    for (let i = 0; i < input2d.length-1; i++) {
        numarray.push(input2d[i]!.map(numStr => parseInt(numStr, 10)));
    }

    for (let i = 1; i < numarray.length; i++) {
        if (numarray[i]!.length !== numarray[0]!.length) {
            throw new Error("Mismatched number of elements in rows");
        }
    }
    if (operatorArray.length !== numarray[0]!.length) {
            throw new Error("Mismatched number of operators and columns");
        }
    const equations: {numarray: number[], operator: string}[] = [];
    for (let i = 0; i < operatorArray.length; i++) {
        const nums: number[] = [];
        for (let r = 0; r < numarray.length; r++) {
            if (numarray[r] === undefined) {
                throw new Error("Undefined row encountered");
            }
            nums.push(numarray[r]![i]!);
        }
        const operator = operatorArray[i] as string;
        equations.push({numarray: nums, operator});
        console.log(`Extracted equation: ${nums.join(", ")}, ${operator}`);
    }
    return equations;
};





export const solveEquation = (equation: {numarray: number[], operator: string}): number => {
    const {numarray, operator} = equation;
    switch(operator) {
        case "*":
            return numarray.reduce((acc, val) => acc * val, 1);
        case "+":
            return numarray.reduce((acc, val) => acc + val, 0);
        default:
            throw new Error(`Unsupported operator: ${operator}`);
    }
};

export const sumEquations = (equations: {numarray: number[], operator: string}[]): number => {
    let total = 0;
    for (const eq of equations) {
        total += solveEquation(eq);
    }
    return total;
};



export const part1 = (input2d: string[]): number => {
    const equations = extractEquations(parseInput(input2d));
    return sumEquations(equations);
};

export const part2 = (input2d: string[]): number => {
    return 0;
};
export const day6 = (input: string[]) => {
    const part1Result: number = part1(input);
    const part2Result: number = part2(input);
    return { part1: part1Result, part2: part2Result};
};

export const parseInput = (input: string[]): string[][] => {
    const parsedInput = input.map(line => line.trim().split(/ +/).filter(token => token.length > 0));
    return parsedInput;
};



export const parseOperators = (operatorString: string): {spacing: number[], operators: string[]} => {
    let chars = operatorString.split("");
    const spacing: number[] = [];
    const operators: string[] = [];
    let count = 0;
    operators.push(chars[0]!); //first character is always an operator
    chars = chars.slice(1);
    for (const char of chars) {
        if (char === " ") {
            count++;
        } else {
            spacing.push(count);
            operators.push(char);
            count = 0;
        }
    }
    spacing.push(count+1); // push the last count
    return {spacing, operators};
};

export const parseInputPreserveSpaces = (input: string[]): {parsedNumsArray: string[][], operatorArray: string[]} => {
    const operatorString: string = input.pop()!;
    const {spacing, operators} = parseOperators(operatorString);
    const parsedNumsArray: string[][] = [];
    for(let line of input) {
        const numStrArray: string[] = [];
        for (let i = 0; i < spacing.length; i++) {
            const spaceCount = spacing[i]!;
            const numStr = line.slice(0, spaceCount);
            console.log(`Extracted numStr: "${numStr}" from line: "${line}" with spaceCount: ${spaceCount}`);
            line = line.slice(spaceCount + 1);
            if (numStr.length > 0) {
                numStrArray.push(numStr);
            }
        }
        parsedNumsArray.push(numStrArray);
    }
    return {parsedNumsArray: parsedNumsArray, operatorArray: operators};

}

export const extractNumbersP2 = (numStrArray: string[][]): number[][] => {
    const numArray: number[][] = [];
    if (numStrArray.length === 0 || numStrArray[0]!.length === 0) throw new Error("Input array is empty.");
    for (let i = 0; i < numStrArray[0]!.length; i++) { //iter over columns
        const strsToParse: string[] = [];
        for (let r = 0; r < numStrArray.length; r++) { //grab each row's ith element
            strsToParse.push(numStrArray[r]![i]!);
        }
        const numChars = strsToParse[0]!.length;
        const strNums: string[] = [];
        for (let m = numChars - 1; m >= 0; m--) { //iter over characters in string number
            let numAsString = "";
            for (const str of strsToParse) {
                numAsString = numAsString + str[m];
            }
            strNums.push(numAsString.trim());
        }
        const parsedNums: number[] = strNums.map(numStr => parseInt(numStr, 10));
        numArray.push(parsedNums);
    }
    return numArray;


}

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
    const {parsedNumsArray, operatorArray} = parseInputPreserveSpaces(input2d);
    const numArray = extractNumbersP2(parsedNumsArray);
    const equations: {numarray: number[], operator: string}[] = [];
    for (let i = 0; i < operatorArray.length; i++) {
        const nums: number[] = numArray[i]!;
        const operator = operatorArray[i]!;
        equations.push({numarray: nums, operator});
    }
    return sumEquations(equations);
};
export const day4 = (input: string[]) => {
    const part1Result: number = part1(input);
    const part2Result: number = part2(input);
    return { part1: part1Result, part2: part2Result};
};

export const parseInput = (input: string[]): {ranges: [number, number][], numbers: number[]} => {
    const rangeStrings: string[] = []
    const numbers: number[] = [];
    let flop = false;
    for (const line of input) {
        if (line === "") {
            flop = true;
            continue;
        }
        if (!flop) {
            rangeStrings.push(line);
        } else {
            numbers.push(parseInt(line));
        }
    }
    const ranges = rangeStrings.map(r => r.split("-").map(rtuple => parseInt(rtuple)) as [number, number]);
    return { ranges, numbers };
};


export const part1 = (input: string[]): number => {
    return 0;
};

export const part2 = (input: string[]): number => {
    return 0;
};
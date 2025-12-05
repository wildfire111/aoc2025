export const day3 = (input: string[]) => {
    const part1Result: number = part1(input);
    const part2Result: number = part2(input);
    return { part1: part1Result, part2: part2Result };
};

export const getMaxJoltage = (input: string): number => {
    const batteryArray: number[] = input.split("").map((v) => parseInt(v, 10));
    if (batteryArray.length <= 1) {
        throw new Error("Array must contain at least two elements.");
    };
    let firstValue = Math.max(...batteryArray);
    let secondValue = 0;
    const firstIndex = batteryArray.indexOf(firstValue);
    if (firstIndex !== batteryArray.length - 1) { //highest value is not at the end
        secondValue = Math.max(...batteryArray.slice(firstIndex + 1));
    } else {
        secondValue = firstValue;
        firstValue = Math.max(...batteryArray.slice(0, firstIndex));
    }
    return parseInt(firstValue.toString() + secondValue.toString());

}
    




export const part1 = (input: string[]): number => {
    let sum = 0;
    for (const line of input) {
        sum += getMaxJoltage(line);
    }
    return sum;
};

export const part2 = (input: string[]): number => {
    // Implement the logic for part 2 here
    return 0;
};
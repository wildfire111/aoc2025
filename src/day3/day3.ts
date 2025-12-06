export const day3 = (input: string[]) => {
    const part1Result: number = part1(input);
    const part2Result: number = part2(input);
    return { part1: part1Result, part2: BigInt(part2Result).toString() };
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

export const returnBiggestNumber = (input: string): number => {
    const batteryArray: number[] = input.split("").map((v) => parseInt(v, 10));
    if (batteryArray.length <= 3) {
        throw new Error("Array must contain more than three elements.");
    };
    const iters = batteryArray.length - 12;
    for (let i = 0; i < iters; i++) {
        for (let j = 0; j < batteryArray.length - 1; j++) {
            if (batteryArray[j]! < batteryArray[j+1]!) {
                batteryArray.splice(j, 1);
                break;
            } else if (j === batteryArray.length - 2) {
                batteryArray.pop();
            }
        }
    }
    return parseInt(batteryArray.reduce((acc, val) => acc + val.toString(), ""));
};
    




export const part1 = (input: string[]): number => {
    let sum = 0;
    for (const line of input) {
        sum += getMaxJoltage(line);
    }
    return sum;
};

export const part2 = (input: string[]): number => {
    let sum = 0;
    for (const line of input) {
        sum += returnBiggestNumber(line);
    }
    return sum;
};
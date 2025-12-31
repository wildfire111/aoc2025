import { machine } from "os";


export const day10 = (input: string[]) => {
    const part1Result: number = part1(input);
    const part2Result: number = part2(input);
    return { part1: part1Result, part2: part2Result};
};

export type Machine = {
    indicatorLights: number;
    buttons: number[];
    buttonArray: number[][];
    joltage: number[];
    buttonMasks: number[];
}

export const strToIndicatorLights = (input: string): number => {
    let strInputAsNumber = "";
    for (let i = 0; i < input.length; i++) {
        const charCode: string = input[i]!;
        charCode == "." ? strInputAsNumber += "0" : strInputAsNumber += "1";
    }
    return parseInt(strInputAsNumber, 2);
}

export const strToButton = (input: string, length: number): number => {
    const splitInput = input.split(",").map(Number);
    let buttonString = "";
    for (let i = 0; i < length; i++) {
        splitInput.includes(i) ? buttonString += "1" : buttonString += "0";
    }
    return parseInt(buttonString, 2);
}

export const getPressesFromMachine = (machine: Machine): number => {
    const presses = findTerminalState(machine.indicatorLights, machine.buttons);
    return presses;
}


export const strToMachine = (input: string): Machine => {
    const indicatorLightStr = input.match(/\[(.*)\]/);
    const buttonStrArray = [...input.matchAll(/\(([^)]*)\)/g)];
    const joltageStr = input.match(/{(.*)}/);

    if (!indicatorLightStr || buttonStrArray.length === 0 ||!joltageStr) {
        throw new Error("Invalid input format");
    }

    const indicatorLights = strToIndicatorLights(indicatorLightStr[1]!);
    const buttons = buttonStrArray.map(match => strToButton(match[1]!, indicatorLightStr[1]!.length));
    const joltage = joltageStr[1]!.split(",").map(numStr => parseInt(numStr.trim(), 10));
    const buttonArray: number[][] = buttonStrArray.map(match => match[1]!.split(",").map(numStr => parseInt(numStr.trim(), 10)));
    const buttonMasks = buttonArray.map(indices => indicesToBitmask(indices));
    
    return {
        indicatorLights,
        buttons,
        joltage,
        buttonArray,
        buttonMasks
    };
}

export const parseInput = (input: string[]): Machine[] => {
    return input.map(line => strToMachine(line));
}

export const pressButton = (machineState: number, button: number): number => {
    return machineState ^ button;
}

export const findTerminalState = (targetState: number, buttons: number[]): number => {
    let presses = 0;
    let currentState = parseInt("0", 2);
    if(currentState === targetState){
            return 0;
    }
    const stateQueue = [{ state: currentState, presses: presses }];
    const visitedStates = new Set();
    visitedStates.add(currentState);
    while(stateQueue.length > 0){
        const { state, presses } = stateQueue.shift()!;
        for(const button of buttons){
            const nextState = pressButton(state, button);
            if(nextState === targetState){
                return presses + 1;
            }
            if(!visitedStates.has(nextState)){
                visitedStates.add(nextState);
                stateQueue.push({ state: nextState, presses: presses + 1 });
            }
        }

        


    }
    return -1; // Target state is unreachable
}

export const addButtonToJoltage = (joltageState: number[], button: number[]): number[] => {
    const newJoltageState = [...joltageState];
    for (let i = 0; i < newJoltageState.length; i++){
        if (button.includes(i)){
            newJoltageState[i]! += 1;
        }
    }
    return newJoltageState;
}

export const isAnyJoltageOverTarget = (joltageState: number[], targetJoltage: number[]): boolean => {
    for(let i = 0; i < joltageState.length; i++){
        if(joltageState[i]! > targetJoltage[i]!){
            return true;
        }
    }
    return false;
}

export const findJoltageTerminalState = (targetJoltage: number[], buttons: number[][]): number => {
    const currentState: number[] = targetJoltage.map(() => 0);
    let presses = 0;
    if(JSON.stringify(currentState) === JSON.stringify(targetJoltage)){
            return 0;
    }
    const stateQueue = [{ state: currentState, presses: presses }];
    const visitedStates = new Set();
    visitedStates.add(currentState.toString());
    while(stateQueue.length > 0){
        const { state, presses } = stateQueue.shift()!;
        for (const button of buttons){
            const nextState = addButtonToJoltage(state, button);
            //console.log("New State:", nextState);
            if(JSON.stringify(nextState) === JSON.stringify(targetJoltage)){
                return presses + 1;
            }
            if (!isAnyJoltageOverTarget(nextState, targetJoltage) && !visitedStates.has(nextState.toString())){
                visitedStates.add(nextState.toString());
                stateQueue.push({ state: nextState, presses: presses + 1 });
                //console.log(stateQueue);
            }
        }
    }
    return -1;
}

export const buildParityCache = (buttons: number[]): Map<number, number[]> => {
    const parityCache: Map<number, number[]> = new Map();
    const buttonCount = buttons.length;
    const totalCombinations = 2 ** buttonCount; //itering over this is a bitmask of all combos
    for (let subsetMask = 0; subsetMask < totalCombinations; subsetMask++){
        let parity = 0;
        for (let i = 0; i < buttonCount; i++){
            if ((subsetMask & (2 ** i)) !== 0){ //bitwise AND to check if ith button is included
                parity = pressButton(parity, buttons[i]!);
            }
        }
        if (!parityCache.has(parity)){
            parityCache.set(parity, []);
        }
        parityCache.get(parity)!.push(subsetMask);
    }
    return parityCache;
}

export const numArrayToBitmask = (numArray: number[]): number => {
    let bitmask = 0;
    for (let i = 0; i < numArray.length; i++){
        if (numArray[i]! !== 0){
            bitmask |= (1 << i);
        }
    }
    return bitmask;
    
}

export const indicesToBitmask = (indices: number[]): number => {
  let bitmask = 0;
  for (const idx of indices) {
    bitmask |= (1 << idx);
  }
  return bitmask;
};


export const getParity = (joltageState: number[]): number => {
    const parity: number[] = [];
    for (let i = 0; i < joltageState.length; i++){
        parity.push(joltageState[i]! % 2);
    }
    return numArrayToBitmask(parity);
}

export type Context = {
    stateCache: Map<string, number>;
    parityCache: Map<number, number[]>;
    buttons: number[];
}

export const subButtonFromRemainder = (remainder: number[], button: number): number[] => {
    const newRemainder = [...remainder];
    for (let i = 0; i < newRemainder.length; i++){ //go down the joltage indices
        if (button & (2 ** i)){ //if this button affects indice
            newRemainder[i]! -= 1;
        }
    }
    return newRemainder;
}

export const countBitsSet = (num: number): number => {
    const numString = num.toString(2);
    let count = 0;
    for (const char of numString){
        if (char === "1"){
            count++;
        }
    }
    return count;
}

export const halveArray = (arr: number[]): number[] => {
    return arr.map(val => Math.floor(val / 2));
}

export const solveState = (joltageState: number[], context: Context): number => {
    console.log("Solving State:", joltageState);
    //base case
    if (joltageState.every(val => val === 0)){
        console.log("Base case reached");
        return 0;
    }
    const parity = getParity(joltageState);
    const remainderKey = joltageState.join(",");
    const hit = context.stateCache.get(remainderKey);
    if (hit){
        console.log(`Cache hit for key ${remainderKey}`);
        return hit;
    }
    const resultArray = [];
    if (!context.parityCache.has(parity)){
        console.log(`No button subsets for parity ${parity.toString(2)}`);
        context.stateCache.set(remainderKey, -1);
        return -1;
    }
    console.log(`Parity: ${parity.toString(2)}`);
    //console.log(`Num button subsets: ${context.parityCache.get(parity)!.length}`);
    for (const buttonMask of context.parityCache.get(parity)!){//grab all the button subsets that match this parity
        console.log(`Trying button mask: ${buttonMask.toString(2).padStart(context.buttons.length, '0')}`);
        let nextState = [...joltageState];
        for (let i = 0; i < context.buttons.length; i++){ //iter over buttons
            if ((buttonMask & (2 ** i)) !== 0){ //if button is pressed in this subset
                nextState = subButtonFromRemainder(nextState, context.buttons[i]!);
            }
        }

        if (!nextState.every(v => v >= 0)) continue;
        if (!nextState.every(v => (v % 2) === 0)) continue;
        nextState = halveArray(nextState);
        const subPresses = solveState(nextState, context);
        if (subPresses !== -1){
            resultArray.push((2*subPresses) + countBitsSet(buttonMask));
        }
    } 
    if (resultArray.length === 0){
        return -1;
    }
    const result = Math.min(...resultArray);
    context.stateCache.set(remainderKey, result);
    return result;
}

export const findJoltagePresses = (machine: Machine): number => {
    const context: Context = {
        stateCache: new Map(),
        parityCache: buildParityCache(machine.buttonMasks),
        buttons: machine.buttonMasks
    };
    const presses = solveState(machine.joltage, context);
    return presses;
}

export const part1 = (input: string[]): number => {
    const machineList = parseInput(input);
    let totalPresses = 0;
    for(const machine of machineList){
        const presses = getPressesFromMachine(machine);
        totalPresses += presses;
    }
    return totalPresses;
}

const part2 = (input: string[]): number => {
    const machineList = parseInput(input);
    let totalJoltagePresses = 0;
    let count = 0;
    for (const machine of machineList){
        const joltagePresses = findJoltagePresses(machine);
        totalJoltagePresses += joltagePresses;
        count++;
        console.log(`Processed machine ${count}/${machineList.length}`);
    }
    return totalJoltagePresses;
}
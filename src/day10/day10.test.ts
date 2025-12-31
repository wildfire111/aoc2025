import { machine } from "os";
import * as day10 from "./day10.js";

describe("strToIndicatorLights", () => {
    it("should convert string to indicator lights correctly", () => {
        expect(day10.strToIndicatorLights(".")).toBe(0);
        expect(day10.strToIndicatorLights("#")).toBe(1);
        expect(day10.strToIndicatorLights("..#")).toBe(1);
        expect(day10.strToIndicatorLights("#.")).toBe(2);
        expect(day10.strToIndicatorLights(".#.#")).toBe(5);
        expect(day10.strToIndicatorLights("####")).toBe(15);
        console.log(day10.strToIndicatorLights("####"));
    });
});

describe("strToButton", () => {
    it("should convert string to buttons correctly", () => {
        expect(day10.strToButton("0", 1).toString(2)).toEqual("1");
        expect(day10.strToButton("0,1", 2).toString(2)).toEqual("11");
        expect(day10.strToButton("1", 2).toString(2)).toEqual("1");
        expect(day10.strToButton("0,1,2,3", 4).toString(2)).toEqual("1111");
        expect(day10.strToButton("0", 5).toString(2)).toEqual("10000");
        expect(day10.strToButton("2,3,4", 5).toString(2)).toEqual("111");


    });
});

describe("pressButton", () => {
    it("should press button correctly", () => {
        expect(day10.pressButton(day10.strToIndicatorLights("#....."), day10.strToButton("0,3,4", 6)).toString(2)).toEqual("110");
    });
    it("should handle sequences of button presses", () => {
        let machineState = day10.strToIndicatorLights("......");
        machineState = day10.pressButton(machineState, day10.strToButton("0,3,4", 6));
        machineState = day10.pressButton(machineState, day10.strToButton("0,1,2,4,5", 6));
        expect(machineState.toString(2)).toEqual("11101");
    });
});

describe("strToMachine", () => {
    it("should convert string to Machine correctly", () => {
        let input = "[.](0){5}";
        let machineState = day10.strToMachine(input);
        expect(machineState.indicatorLights).toBe(0);
        expect(machineState.buttons).toEqual([1]);
        expect(machineState.joltage).toEqual([5]);
        input = "[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}"
        machineState = day10.strToMachine(input);
        expect(machineState.indicatorLights).toBe(2);
        expect(machineState.buttons).toEqual([23,6,17,28,15]);
        expect(machineState.joltage).toEqual([7,5,12,7,2]);

    });
});

describe("findTerminalState", () => {
    it("should find terminal state with minimum button presses", () => {
        const targetState = day10.strToIndicatorLights("###");
        const buttons = [
            day10.strToButton("0", 3),
            day10.strToButton("1", 3),
            day10.strToButton("2", 3)
        ];
        const presses = day10.findTerminalState(targetState, buttons);
        expect(presses).toBe(3);
    });
    it("should return 0 if already in target state", () => {
        const targetState = day10.strToIndicatorLights("..");
        const buttons = [
            day10.strToButton("0", 2),
            day10.strToButton("1", 2)
        ];
        const presses = day10.findTerminalState(targetState, buttons);
        expect(presses).toBe(0);
    });
    it("should return -1 if target state is unreachable", () => {
        const targetState = day10.strToIndicatorLights("##");
        const buttons = [
            day10.strToButton("0", 2)
        ];
        const presses = day10.findTerminalState(targetState, buttons);
        expect(presses).toBe(-1);
    });
    it("should handle example case", () => {
        const firstMachine = day10.strToMachine("[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}");
        const targetState =  firstMachine.indicatorLights;
        const buttons = firstMachine.buttons;
        const presses = day10.findTerminalState(targetState, buttons);
        expect(presses).toBe(2);
    });
    it("should handle second example case", () => {
        const secondMachine = day10.strToMachine("[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}");
        const targetState =  secondMachine.indicatorLights;
        const buttons = secondMachine.buttons;
        const presses = day10.findTerminalState(targetState, buttons);
        expect(presses).toBe(3);
    });
    it("should handle third example case", () => {
        const thirdMachine = day10.strToMachine("[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}");
        const presses = day10.getPressesFromMachine(thirdMachine);
        expect(presses).toBe(2);
    });
});

describe("day1 part1", () => {
    it("should solve part 1 example case", () => {
        const input = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`.split("\n");
        const result = day10.part1(input);
        expect(result).toBe(7);
    });
});

describe("addButtonToJoltage", () => {
    it("should add button to joltage state correctly", () => {
        const joltageState = [0,0,0,0,0];
        const button = [1,3];
        const newJoltageState = day10.addButtonToJoltage(joltageState, button);
        expect(newJoltageState).toEqual([0,1,0,1,0]);
    });
});

describe("isAnyJoltageOverTarget", () => {
    it("should return true if any joltage is over target", () => {
        const joltageState = [5,10,15,20];
        const targetJoltage = [10,10,10,10];
        const result = day10.isAnyJoltageOverTarget(joltageState, targetJoltage);
        expect(result).toBe(true);
    });
    it("should return false if no joltage is over target", () => {
        const joltageState = [5,10,10,8];
        const targetJoltage = [10,10,10,10];
        const result = day10.isAnyJoltageOverTarget(joltageState, targetJoltage);
        expect(result).toBe(false);
    });
});

describe("findJoltageTerminalState", () => {
    it("should find joltage terminal state with minimum button presses", () => {
        const targetJoltage = [1,1,1];
        const buttons = [[0,1,2]];
        const presses = day10.findJoltageTerminalState(targetJoltage, buttons);
        expect(presses).toBe(1);
    });
    it("should find joltage terminal state with multiple button presses", () => {
        const targetJoltage = [1,1,1];
        const buttons = [[0], [1], [2]];
        const presses = day10.findJoltageTerminalState(targetJoltage, buttons);
        expect(presses).toBe(3);
    });
    it("should return 0 if already in target joltage state", () => {
        const targetJoltage = [0,0,0];
        const buttons = [[0], [1], [2]];
        const presses = day10.findJoltageTerminalState(targetJoltage, buttons);
        expect(presses).toBe(0);
    });
    it("should correctly handle example case 1", () => {
        const input = "[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}";
        const machine = day10.strToMachine(input);
        const targetJoltage = machine.joltage;
        const buttons = machine.buttonArray;
        const presses = day10.findJoltageTerminalState(targetJoltage, buttons);
        expect(presses).toBe(10);
    });
    it("should correctly handle example case 2", () => {
        const input = "[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}";
        const machine = day10.strToMachine(input);
        const targetJoltage = machine.joltage;
        const buttons = machine.buttonArray;
        const presses = day10.findJoltageTerminalState(targetJoltage, buttons);
        expect(presses).toBe(12);
    });
    it("should correctly handle example case 3", () => {
        const input = "[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}";
        const machine = day10.strToMachine(input);
        const targetJoltage = machine.joltage;
        const buttons = machine.buttonArray;
        const presses = day10.findJoltageTerminalState(targetJoltage, buttons);
        expect(presses).toBe(11);
    });
});
describe("buildParityCache", () => {
    it("should build one button cache correctly", () => {
        const buttons = [1];
        const cache = day10.buildParityCache(buttons);
        const resultingCache = new Map();
        resultingCache.set(0b0, [0b0]);
        resultingCache.set(0b1, [0b1]);
        expect(cache).toEqual(resultingCache);
    });
    it("should build two button cache correctly", () => {
        const buttons = [0b01, 0b10];
        const cache = day10.buildParityCache(buttons);
        const resultingCache = new Map();
        resultingCache.set(0b00, [0b00]);
        resultingCache.set(0b01, [0b01]);
        resultingCache.set(0b10, [0b10]);
        resultingCache.set(0b11, [0b11]);
        expect(cache).toEqual(resultingCache);
    });
    it("should build three button cache correctly", () => {
        const buttons = [0b101, 0b010, 0b100];
        const cache = day10.buildParityCache(buttons);
        const resultingCache = new Map();
        resultingCache.set(0b000, [0b000]);
        resultingCache.set(0b001, [0b101]); 
        resultingCache.set(0b010, [0b010]);
        resultingCache.set(0b011, [0b111]);
        resultingCache.set(0b100, [0b100]);
        resultingCache.set(0b101, [0b001]);
        resultingCache.set(0b110, [0b110]);
        resultingCache.set(0b111, [0b011]);
        expect(cache).toEqual(resultingCache);
    });
    it("should build multiple path cache correctly", () => {
        const buttons = [0b01, 0b01, 0b10];
        const cache = day10.buildParityCache(buttons);
        const resultingCache = new Map();
        resultingCache.set(0b00, [0b000, 0b011]);
        resultingCache.set(0b01, [0b001, 0b010]);
        resultingCache.set(0b10, [0b100, 0b111]);
        resultingCache.set(0b11, [0b101, 0b110]);
        expect(cache).toEqual(resultingCache);
    });



});

describe("getParity", () => {
    it("should get parity correctly", () => {
        const joltageState = [5,10,15];
        const parity = day10.getParity(joltageState);
        expect(parity).toEqual(0b101);
    });
    it("should get parity correctly with zeros", () => {
        const joltageState = [0,1,0,3];
        const parity = day10.getParity(joltageState);
        expect(parity).toEqual(0b1010);
    });
});

describe("solveState", () => {
    it("should return 0 presses on 0 joltage array", () => {
        const buttons = [0b1, 0b10, 0b100];
        const context: day10.Context = {
            stateCache: new Map(),
            parityCache: day10.buildParityCache(buttons),
            buttons: buttons
        };
        const joltageState = [0,0,0];
        const presses = day10.solveState(joltageState, context);
        expect(presses).toBe(0);
    });
    it("should solve simple joltage state", () => {
        const buttons = [0b1, 0b10, 0b100];
        const context: day10.Context = {
            stateCache: new Map(),
            parityCache: day10.buildParityCache(buttons),
            buttons: buttons
        };
        const joltageState = [1,1,1];
        const presses = day10.solveState(joltageState, context);
        expect(presses).toBe(3);
    });
    it("should solve more complex joltage state", () => {
        const machineStr = "[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}";
        const machine = day10.strToMachine(machineStr);
        const context: day10.Context = {
            stateCache: new Map(),
            parityCache: day10.buildParityCache(machine.buttonMasks),
            buttons: machine.buttonMasks
        };
        const joltageState = machine.joltage;
        const presses = day10.solveState(joltageState, context);
        expect(presses).toBe(10);
    });
});


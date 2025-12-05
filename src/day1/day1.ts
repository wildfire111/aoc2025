


export const day1 = (input: string[]) => {
    const parsedInput = input.map(parseInstruction);
    const part1Result: number = part1(parsedInput);
    const part2Result: number = part2(parsedInput);
    return { part1: part1Result, part2: part2Result };

};

export const part1 = (input: number[]) => {
    let position = 50;
    let hits = 0;
    let newPos = position;
    for (const move of input) {
        newPos = turn(position, move);
        if(newPos === 0) {
            hits += 1;
        }
        console.log(`Start at ${position}, move ${move} to ${newPos}`);
        position = newPos;
        
    }
    return hits;
}

export const part2 = (input: number[]) => {
    let position = 50;
    let hits = 0;
    for (const move of input) {
        const moveHits = getHits(position, move);
        hits += moveHits;
        position = turn(position, move);
    }
    return hits;
}

export const getHits = (position: number, move: number) => {
    if (move === 0) {
        return 0;
    }
    //get full rotations
    const fullRotations = Math.floor(Math.abs(move) / 100);
    let hits = fullRotations;
    const smallMove = move % 100;
    const tempPos = position + smallMove;
    if ((tempPos <= 0 || tempPos >= 100) && position !== 0 && smallMove !== 0) {
        hits += 1;
    }
    console.log(`From ${position} moving ${move} is ${fullRotations} full rotations and ${hits} hits`);
    return hits;
}


const parseInstruction = (instruction: string) => {
    const direction = instruction.charAt(0);
    const distance = parseInt(instruction.slice(1)) * (direction === "R" ? 1 : -1);
    return distance;
}

export const turn = (position: number, move: number) => {
    const smallMove = move % 100;
    const tempPos = position + smallMove;
    if (tempPos >= 100) {
        return tempPos - 100;
    } else if (tempPos < 0) {
        return 100 + tempPos;
    } else {
        return tempPos;
    }
}
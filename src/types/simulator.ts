// for skill and booster simulator
type FastChanceResult = number;
type FastPointsResult = number;

// for troll or pantheon pre battle
interface ChanceResult {
    chance: number;
    alwaysWin: boolean;
    neverWin: boolean;
}

// for league table
interface PointsResult {
    avgPoints: number;
    minPoints: number;
}

// for league pre battle
interface FullResult {
    chance: number;
    alwaysWin: boolean;
    neverWin: boolean;
    avgPoints: number;
    minPoints: number;
    maxPoints: number;
    pointsTable: number[];
}

// for global
interface StandardResult {
    chance: number;
    alwaysWin: boolean;
    neverWin: boolean;
    avgPoints: number;
    minPoints: number;
    maxPoints: number;
}

type SimulationType = 'FastChance' | 'FastPoints' | 'Chance' | 'Points' | 'Standard' | 'Full';

type SimulationResult<T extends SimulationType> = T extends 'FastChance'
    ? FastChanceResult
    : T extends 'FastPoints'
    ? FastPointsResult
    : T extends 'Chance'
    ? ChanceResult
    : T extends 'Points'
    ? PointsResult
    : T extends 'Standard'
    ? StandardResult
    : T extends 'Full'
    ? FullResult
    : never;

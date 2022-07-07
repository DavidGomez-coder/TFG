const CELL_MULTIPLIERS = {
    "nanoV" : 0.000000001,
    "microV": 0.000001,
    "miliV":0.001,
    "V" : 1
}

export function getCellMultiplier (multiplier){
    return CELL_MULTIPLIERS[multiplier];
}
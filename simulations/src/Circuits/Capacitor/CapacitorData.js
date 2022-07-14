const CAPACITOR_MULTS = {
    "nanoF"  :  0.000000001,
    "microF" :  0.000001,
    "miliF"  :  0.001,
    "F"      :  1
}

export function getCapacitorMult(multiplier){
    return CAPACITOR_MULTS[multiplier];
}
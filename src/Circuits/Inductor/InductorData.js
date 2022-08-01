const INDUCTOR_MULTS = {
    "nanoH"  :  0.000000001,
    "microH" :  0.000001,
    "miliH"  :  0.001,
    "H"      :  1
}

export function getInductorMult(multiplier){
    return INDUCTOR_MULTS[multiplier];
}
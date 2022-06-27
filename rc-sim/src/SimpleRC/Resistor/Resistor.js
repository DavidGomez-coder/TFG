import { MULTIPLIER_BANDS, MULTIPLIER_VALUES, VALUE_BANDS } from "./ResistorData.js";

export function calculateColorBands (value, multiplier) {
    let colors = ["", "", "", "#B22222"];
    let value_str = value.toString();
    let multiplier_str = multiplier.toString();
    let first_digit = parseInt(value_str[0]);
    let secnd_digit = parseInt(value_str[1]);

    colors[0] = VALUE_BANDS[first_digit];
    colors[1] = VALUE_BANDS[secnd_digit];
    
    colors[2] = MULTIPLIER_BANDS[multiplier];
    return colors;
}

export function valueOfMultiplier (multiplier){
    console.log(multiplier)
    console.log(MULTIPLIER_VALUES[multiplier])
    return parseFloat(MULTIPLIER_VALUES[multiplier]);
}
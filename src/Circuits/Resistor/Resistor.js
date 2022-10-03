import { MULTIPLIER_BANDS, MULTIPLIER_VALUES, VALUES_MULTIPLIER, VALUE_BANDS } from "./ResistorData.js";

export function calculateColorBands (value, multiplier) {
    let colors = ["", "", "", "#B22222"];
    let value_str = (value * 100).toString();
    let multiplier_str = multiplier.toString();
    let first_digit = parseInt(value_str[0]);
    let secnd_digit = parseInt(value_str[1]);

    colors[0] = VALUE_BANDS[first_digit];
    colors[1] = VALUE_BANDS[secnd_digit];
    
    let multiplier_v = VALUES_MULTIPLIER[multiplier];
    colors[2] = MULTIPLIER_BANDS[multiplier_v];
    return colors;
}

export function valueOfMultiplier (multiplier){
    return parseFloat(MULTIPLIER_VALUES[multiplier]);
}
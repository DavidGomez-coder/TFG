/**
 * @module RLFormulas Módulo para la especificación de las expresiones correspondientes a 
 * la simulación de un circuito RL
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

function getI_charge(t, i_0, V, L, R) {
    return (V/R)*(1- Math.pow(Math.E, (-R * t)/L));
}

function getI_discharge(t, i_0, V, L, R){
    return (V/R) * Math.pow(Math.E, (-R * t)/L);
}

function getE(L, I){
    return (1/2)*L*Math.pow(I, 2);
}

export function getChargeInstant(t, i_0, V, L, R) {
    let i_t = getI_charge(t, undefined, V, L, R);
    return {
        "I" : i_t,
        "Vr": i_t * R,
        "Vl": V*(Math.pow(Math.E, (-R * t)/L)),
        "E" : getE(L, i_t),
        "PHI": L * i_t
    }
}

export function getDischargeInstant (t, i_0, V, L, R){
    let i_t = getI_discharge(t, i_0, undefined, L, R);
    return {
        "I" : i_t,
        "Vr" : i_t * R,
        "Vl" : Math.abs(-V * (Math.pow(Math.E, (-R * t)/L))),
        "E" : getE(L, i_t),
        "PHI": L * i_t
    }
}
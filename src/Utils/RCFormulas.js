/**
 * @module RCFormulas Módulo para la especificación de las expresiones correspondientes a 
 * la simulación de un circuito RC
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

function getQ_charge(t, q_0, V, C, R) {
    return C*V*(1-Math.pow(Math.E, (-t) / (R * C)));
}

function getQ_discharge(t, q_0, R, C){
    return q_0 * Math.pow(Math.E, (-t) / (R * C)); 
}

function getI_charge(t, q_0, V, C, R) {
    return (V/R)*Math.pow(Math.E, (-t) / (R * C));
}

function getI_discharge(t, q_0, C, R){
    return Math.abs((-q_0/(R*C)) * Math.pow(Math.E, (-t) / (R * C)));
}

function getE(C, V) {
    return (1/2)*C*Math.pow(V, 2);
}

export function getChargeInstant(t, q_0, V, C, R){
    return {
        "Q"  : getQ_charge(t, q_0, V, C, R),
        "Vc" : getQ_charge(t, q_0, V, C, R) / C,
        "I"  : getI_charge(t, q_0, V, C, R),
        "Vr" : getI_charge(t, q_0, V, C, R) * R,
        "E"  : getE(C, getQ_charge(t, q_0, V, C, R) / C)
    }
}

export function getDischargeInstant(t, q_0, V, C, R){
    return {
        "Q"  : getQ_discharge(t, q_0, R, C),
        "Vc" : getQ_discharge(t, q_0, R, C) / C,
        "I"  : getI_discharge(t, q_0, C, R),
        "Vr" : getI_discharge(t, q_0, C, R) * R,
        "E"  : getE(C, getQ_discharge(t, q_0, R, C) / C)
    }
}


//it --> time increment in 1 second
export function getChargeTimeData(init, final, it, q_0, V, C, R) {
    let result = [];
    for (let i=init; i<final; i+=it){
        result = [...result, {"time" : i, "data" : getChargeInstant(i, q_0, V, C, R)}];
    }
    return result;
}

export function getDischargeTimeData(init, final, it, q_0, V, C, R){
    let result = [];
    for(let i=init; i<final; i+=it){
        result = [...result, {"time" : i, "data" : getDischargeInstant(i, q_0, V, C, R)}];
    }
    return result;
}
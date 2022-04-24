/**
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { ComponentsIds } from "../../src/model/circuit/ComponentsIds";
import { Cell } from "../../src/model/component.items/Cell";
import { Component } from "../../src/model/component.items/Component";
import { Inductor } from "../../src/model/component.items/Inductor";
import { Resistor } from "../../src/model/component.items/Resistor";
import { Switch } from "../../src/model/component.items/Switch";
import { RlSimulation } from "../../src/model/simulations/RlSimulation";
import { SimpleRLCircuitResult } from "../../src/model/simulations/SimpleRLCircuitResult";
import { reloadDataBase, RL_CIRCUIT } from "../globalDatabase";

beforeAll(() => {
    reloadDataBase();
});


describe("Simulación de un circuito RL simple en estado de almacenamiento de energía", () => {
    let rlsim: RlSimulation = new RlSimulation(RL_CIRCUIT);
    let results: SimpleRLCircuitResult[] = <SimpleRLCircuitResult[]>rlsim.getResults();

    let randomT: number = Math.trunc(Math.random()*(results.length));
    let obtained_t: number = results[randomT].getT();
    let obtained_Vr: number = results[randomT].getVr();
    let obtained_Vl: number = results[randomT].getVl();
    let obtained_E: number = results[randomT].getE();
    let obtained_I: number = results[randomT].getI();
    let obtained_phi: number = results[randomT].getPhi();
    let obtained_fem: number = results[randomT].getFem();

    let inductor: Inductor = <Inductor>RL_CIRCUIT.getComponentById(ComponentsIds.INDUCTOR_ID);
    let resistor: Resistor = <Resistor>RL_CIRCUIT.getComponentById(ComponentsIds.RESISTOR_ID);
    let cell: Cell = <Cell>RL_CIRCUIT.getComponentById(ComponentsIds.CELL_ID);

    // expresiones empleadas
    let I: number = (cell.getComponentValue()/resistor.getComponentValue())*(1-Math.pow(Math.E, (-obtained_t*resistor.getComponentValue())/(inductor.getComponentValue())));
    let Vr: number = resistor.getComponentValue()*I;
    let Vl: number = resistor.getComponentValue()*cell.getComponentValue()*(1-Math.pow(Math.E, (-obtained_t*resistor.getComponentValue())/(inductor.getComponentValue())));
    let E: number = (1/2)*inductor.getComponentValue()*Math.pow(I,2);
    let fem: number = -Vl;
    let phi: number = inductor.getComponentValue()*I;

    //tests
    test("Diferencia de potencial en la resistencia", () =>{
        expect(obtained_Vr).toBe(Vr);
    });

    test("Diferencia de potencial en el inductor", () => {
        expect(obtained_Vl).toBe(Vl);
    });

    test("Energía almacenada", () => {
        expect(obtained_E).toBe(E);
    });

    test("Intensidad de corriente", () => {
        expect(obtained_I).toBe(I);
    });

    test("Flujo magnético", () => {
        expect(obtained_phi).toBe(phi);
    });

    test("Fuerza electromotriz", () => {
        expect(obtained_fem).toBe(fem);
    });
});

describe("Simulación de un circuito RL simple en estado de disipación de energía", () => {
    (<Switch>RL_CIRCUIT.getComponentById(ComponentsIds.SWITCH_ID)).changeValue();
    let rlsim: RlSimulation = new RlSimulation(RL_CIRCUIT);
    let results: SimpleRLCircuitResult[] = <SimpleRLCircuitResult[]>rlsim.getResults();

    let randomT: number = Math.trunc(Math.random()*(results.length));
    let obtained_t: number = results[randomT].getT();
    let obtained_Vr: number = results[randomT].getVr();
    let obtained_Vl: number = results[randomT].getVl();
    let obtained_E: number = results[randomT].getE();
    let obtained_I: number = results[randomT].getI();
    let obtained_phi: number = results[randomT].getPhi();
    let obtained_fem: number = results[randomT].getFem();

    let inductor: Inductor = <Inductor>RL_CIRCUIT.getComponentById(ComponentsIds.INDUCTOR_ID);
    let resistor: Resistor = <Resistor>RL_CIRCUIT.getComponentById(ComponentsIds.RESISTOR_ID);
    let cell: Cell = <Cell>RL_CIRCUIT.getComponentById(ComponentsIds.CELL_ID);

    // expresiones empleadas
    let i_max: number = cell.getComponentValue()/resistor.getComponentValue();
    let I: number = i_max*Math.pow(Math.E, (-obtained_t*resistor.getComponentValue())/(inductor.getComponentValue()));
    let Vr: number = resistor.getComponentValue()*I;
    let Vl: number = -resistor.getComponentValue()*i_max*Math.pow(Math.E, (-obtained_t*resistor.getComponentValue())/(inductor.getComponentValue()));
    let E: number = (1/2)*inductor.getComponentValue()*Math.pow(I,2);
    let fem: number = -Vl;
    let phi: number = inductor.getComponentValue()*I;

    //tests
    test("Diferencia de potencial en la resistencia", () =>{
        expect(obtained_Vr).toBe(Vr);
    });

    test("Diferencia de potencial en el inductor", () => {
        expect(obtained_Vl).toBe(Vl);
    });

    test("Energía almacenada", () => {
        expect(obtained_E).toBe(E);
    });

    test("Intensidad de corriente", () => {
        expect(obtained_I).toBe(I);
    });

    test("Flujo magnético", () => {
        expect(obtained_phi).toBe(phi);
    });

    test("Fuerza electromotriz", () => {
        expect(obtained_fem).toBe(fem);
    });
});

afterAll(() => {
    reloadDataBase();
});
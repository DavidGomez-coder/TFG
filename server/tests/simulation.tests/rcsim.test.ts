/**
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */
import { ComponentsIds } from "../../src/model/circuit/ComponentsIds";
import { Capacitor } from "../../src/model/component.items/Capacitor";
import { Cell } from "../../src/model/component.items/Cell";
import { Resistor } from "../../src/model/component.items/Resistor";
import { Switch } from "../../src/model/component.items/Switch";
import { CircuitSimulation } from "../../src/model/simulations/CircuitSimulation";
import { RcSimulation } from "../../src/model/simulations/RcSimulation";
import { SimpleRCCircuitResult } from "../../src/model/simulations/SimpleRCCircuitResult";
import { RC_CIRCUIT, reloadDataBase } from "../globalDatabase";

beforeAll(() => {
    reloadDataBase();
});

describe ("Simulación de un circuito RC en estado de carga", () => {
    let rcsim: RcSimulation = new RcSimulation(RC_CIRCUIT);
    let results = <SimpleRCCircuitResult[]>rcsim.getResults();

    let randomT: number = Math.trunc(Math.random()*(results.length));
    let obtained_q: number = results[randomT].getQ();
    let obtained_t: number = results[randomT].getT();
    let obtained_Vr: number = results[randomT].getVr();
    let obtained_Vc: number = results[randomT].getVc();
    let obtained_E: number = results[randomT].getE();
    let obtained_I: number = results[randomT].getI();

    let capacitor: Capacitor = <Capacitor>RC_CIRCUIT.getComponentById(ComponentsIds.CAPACITOR_ID);
    let resistor: Resistor = <Resistor>RC_CIRCUIT.getComponentById(ComponentsIds.RESISTOR_ID);
    let cell: Cell = <Cell>RC_CIRCUIT.getComponentById(ComponentsIds.CELL_ID);

    // expresiones empleadas
    let q : number = capacitor.getComponentValue()*cell.getComponentValue()*(1-Math.pow(Math.E, (-obtained_t)/(resistor.getComponentValue()*capacitor.getComponentValue())));
    let Vc: number = q/capacitor.getComponentValue();
    let I : number = (cell.getComponentValue()/resistor.getComponentValue())*Math.pow(Math.E, (-obtained_t)/(resistor.getComponentValue()*capacitor.getComponentValue()));
    let Vr: number = I*resistor.getComponentValue();
    let E: number = (1/2)*capacitor.getComponentValue()*Math.pow(Vc, 2);

    //tests
    test("Carga del condensador", () => {
        expect(obtained_q).toBe(q);
    });

    test("Diferencia de potencial en la resistencia", () => {
        expect(obtained_Vr).toBe(Vr);
    });

    test("Diferencia de potencial en el condensador", () => {
        expect(obtained_Vc).toBe(Vc);
    });

    test("Energía almacenada", () => {
        expect(obtained_E).toBe(E);
    });

    test("Intensidad de corriente", () => {
        expect(obtained_I).toBe(I);
    });

});

describe("Simulación de un circuito RC en estado de descarga", () => {
    (<Switch>RC_CIRCUIT.getComponentById(ComponentsIds.SWITCH_ID)).changeValue();
    let rcsim: RcSimulation = new RcSimulation(RC_CIRCUIT);
    let results = <SimpleRCCircuitResult[]>rcsim.getResults();

    let randomT: number = Math.trunc(Math.random()*(results.length));
    let obtained_q: number = results[randomT].getQ();
    let obtained_t: number = results[randomT].getT();
    let obtained_Vr: number = results[randomT].getVr();
    let obtained_Vc: number = results[randomT].getVc();
    let obtained_E: number = results[randomT].getE();
    let obtained_I: number = results[randomT].getI();

    let capacitor: Capacitor = <Capacitor>RC_CIRCUIT.getComponentById(ComponentsIds.CAPACITOR_ID);
    let resistor: Resistor = <Resistor>RC_CIRCUIT.getComponentById(ComponentsIds.RESISTOR_ID);
    let cell: Cell = <Cell>RC_CIRCUIT.getComponentById(ComponentsIds.CELL_ID);

    // expresiones empleadas
    let q_max: number = capacitor.getComponentValue()*cell.getComponentValue();
    let q: number  = q_max*Math.pow(Math.E, (-obtained_t)/(resistor.getComponentValue()*capacitor.getComponentValue()));
    let Vc: number = q/capacitor.getComponentValue();
    let I: number  = (-q_max)/(resistor.getComponentValue()*capacitor.getComponentValue())*Math.pow(Math.E, (-obtained_t)/(resistor.getComponentValue()*capacitor.getComponentValue()));
    let Vr: number = I*resistor.getComponentValue();
    let E: number = (1/2)*capacitor.getComponentValue()*Math.pow(Vc, 2);

    //tests
    test("Carga del condensador", () => {
        expect(obtained_q).toBe(q);
    });

    test("Diferencia de potencial en la resistencia", () => {
        expect(obtained_Vr).toBe(Vr);
    });

    test("Diferencia de potencial en el condensador", () => {
        expect(obtained_Vc).toBe(Vc);
    });

    test("Energía almacenada", () => {
        expect(obtained_E).toBe(E);
    });

    test("Intensidad de corriente", () => {
        expect(obtained_I).toBe(I);
    });
});

afterAll(() => {
    reloadDataBase();
});
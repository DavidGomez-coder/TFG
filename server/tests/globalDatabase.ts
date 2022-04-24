/**
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */
import { ComponentFactory } from "../src/model/component.factory/ComponentFactory";
import { Capacitor } from "../src/model/component.items/Capacitor";
import { Resistor } from "../src/model/component.items/Resistor";
import { Cell }  from "../src/model/component.items/Cell"
import { Inductor } from "../src/model/component.items/Inductor";
import { Circuit } from "../src/model/circuit/Circuit";
import { CircuitFactory } from "../src/model/circuit/CircuitFactory";

let resistor: Resistor = ComponentFactory.createResistor("R0",19,"x1");
let capacitor: Capacitor = ComponentFactory.createCapacitor("C6", 11, "miliF");
let cell: Cell = ComponentFactory.createCell("V4", 11);
let inductor: Inductor = ComponentFactory.createInductor("L2", 14, "miliH");

// ELEMENTOS USADOS PARA LA EJECUCIÓN DE LOS TESTS
export let circuit: Circuit = new Circuit();
circuit.addComponent(resistor);
circuit.addComponent(capacitor);
circuit.addComponent(cell);
circuit.addComponent(inductor);

export let circuit2: Circuit = new Circuit();
circuit2.setComponents(circuit.getComponents());
circuit2.deleteComponent("R0");


export let RC_CIRCUIT: Circuit = <Circuit>CircuitFactory.createCircuit("RC");
export let RL_CIRCUIT: Circuit = <Circuit>CircuitFactory.createCircuit("RL");


//MÉTODO PARA RECARGAR LOS VALORES POR DEFECTO
export function reloadDataBase() {
    circuit = new Circuit();
    circuit.addComponent(resistor);
    circuit.addComponent(capacitor);
    circuit.addComponent(cell);
    circuit.addComponent(inductor);

    circuit2 = new Circuit();
    circuit2.setComponents(circuit.getComponents());
    circuit2.deleteComponent("R0");

    RC_CIRCUIT = <Circuit>CircuitFactory.createCircuit("RC");
    RL_CIRCUIT = <Circuit>CircuitFactory.createCircuit("RL");

}



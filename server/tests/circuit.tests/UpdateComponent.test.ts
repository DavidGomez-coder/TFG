import { Capacitor } from "../../src/model/component.items/Capacitor";
import { Component } from "../../src/model/component.items/Component";
import { Inductor } from "../../src/model/component.items/Inductor";
import { Resistor } from "../../src/model/component.items/Resistor"
import { Switch } from "../../src/model/component.items/Switch";
import { circuit, reloadDataBase } from "../globalDatabase"

beforeAll(() => {
   reloadDataBase();
});

describe("Actualizar valor de un componente existente", () => {
    let newResistor: Resistor = new Resistor("R0", 5, "x10");
    
    test("Cambia valor resistencia R0", () => {
        circuit.updateComponent(newResistor);
        expect(circuit.getComponentById("R0")?.getValue()).toBe(newResistor.getValue());
    });

    let newCapacitor: Capacitor = new Capacitor("C6", 8, "nanoF");
    test("Cambia valor condensador C6", () => {
        circuit.updateComponent(newCapacitor);
        expect(circuit.getComponentById("C6")?.getValue()).toBe(newCapacitor.getValue());
    });

    let newInductor: Inductor = new Inductor("L2", 7, "H");
    test("Cambia valor a inductor L2", () => {
        circuit.updateComponent(newInductor);
        expect(circuit.getComponentById("L2")?.getValue()).toBe(newInductor.getValue());
    });

});

describe("Actualizar valor de un componente no existente", () => {
    test("Cambia valor a U7", () => {
        let noExistentComponent: Component = new Component("Cell", "U7", 0);
        circuit.updateComponent(noExistentComponent);
        expect(circuit.getComponentById("U7")?.getValue()).toBeUndefined();
    });

    let sw: Switch = new Switch("S0", 0);
    test("Cambia valor interruptor S0", () => {
        circuit.updateComponent(sw);
        expect(circuit.getComponentById("S0")?.getValue()).toBeUndefined();
    });
});



afterAll(()=> {
    reloadDataBase();
});
import { ComponentFactory } from "../../src/model/component.factory/ComponentFactory";
import { Capacitor } from "../../src/model/component.items/Capacitor";
import { Cell } from "../../src/model/component.items/Cell";
import { Inductor } from "../../src/model/component.items/Inductor";
import { Resistor } from "../../src/model/component.items/Resistor";
import { Switch } from "../../src/model/component.items/Switch";
import { reloadDataBase } from "../globalDatabase"

beforeAll(() => {
    reloadDataBase();
});


describe("Instancia de un componente", () => {

    test("Instancia de una fuente", () => {
        let cell: Cell = ComponentFactory.createCell("U0", 10);
        expect(cell.getType()).toBe("Cell");
    });

    test("Instancia de una resistencia", () => {
        let resistor: Resistor = ComponentFactory.createResistor("R0", 10, "x1");
        expect(resistor.getType()).toBe("Resistor");
    });

    test("Instancia de un inductor", () => {
        let inductor: Inductor = ComponentFactory.createInductor("I0", 10, "H");
        expect(inductor.getType()).toBe("Inductor");
    });

    test("Instancia de un condensador", () => {
        let capacitor: Capacitor = ComponentFactory.createCapacitor("C0", 10, "F");
        expect(capacitor.getType()).toBe("Capacitor");
    });

    test("Instancia de interruptor", () => {
        let swi: Switch = ComponentFactory.createSwitch("S0", 1);
        expect(swi.getType()).toBe("Switch");
    });

});

afterAll(() => {
    reloadDataBase();
});
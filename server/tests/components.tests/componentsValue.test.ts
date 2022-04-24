/**
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */
import { ComponentFactory } from "../../src/model/component.factory/ComponentFactory";
import { Capacitor } from "../../src/model/component.items/Capacitor";
import { Cell } from "../../src/model/component.items/Cell";
import { Inductor } from "../../src/model/component.items/Inductor";
import { Resistor } from "../../src/model/component.items/Resistor";
import { Switch } from "../../src/model/component.items/Switch";
import { capacitorMults } from "../../src/model/constants/CapacitorData";
import { cellMuls } from "../../src/model/constants/CellData";
import { inductorMuls } from "../../src/model/constants/InductorData";
import { multiplierValues } from "../../src/model/constants/ResistorData";
import { reloadDataBase } from "../globalDatabase"

beforeAll(() => {
    reloadDataBase();
});

describe("Cálculo de los valores del componente", () => {
    
    test("Valor de un interruptor", () => {
        let swi: Switch = ComponentFactory.createSwitch("S0", 1);
        expect(swi.getComponentValue()).toBe(1);
    });

    test("Valor de una resistencia (prueba de los multiplicadores)", () => {
        multiplierValues.forEach((multiplier_numb: number, multiplier_str: string) => {
            let value: number = parseFloat((Math.random()*(100)).toFixed(2));
            let resistor: Resistor = ComponentFactory.createResistor("R0", value, multiplier_str);
            expect(resistor.getComponentValue()).toBe(value*multiplier_numb);
        });
    });

    test("Valor de un condensador (prueba de los multiplicadores)", () => {
        capacitorMults.forEach((multiplier_numb: number, multiplier_str: string) => {
            let value: number = parseFloat((Math.random()*(100)).toFixed(2));
            let capacitor: Capacitor = ComponentFactory.createCapacitor("C0", value, multiplier_str);
            expect(capacitor.getComponentValue()).toBe(value*multiplier_numb);
        });
    });

    test("Valor de una fuente (prueba de multiplicadores)", () => {
        cellMuls.forEach((multiplier_num: number, multiplier_str: string) => {
            let value: number = parseFloat((Math.random()*(100)).toFixed(2));
            let cell: Cell = ComponentFactory.createCell("U0", value);
            cell.setMultiplier(multiplier_str);
            expect(cell.getComponentValue()).toBe(value*multiplier_num);
        });
    });

    test("Valor de un inductor (prueba de multiplicadores)", () => {
        inductorMuls.forEach((multiplier_num: number, multiplier_str: string) => {
            let value: number = parseFloat((Math.random()*(100)).toFixed(2));
            let inductor: Inductor = ComponentFactory.createInductor("I0", value, multiplier_str);
            expect(inductor.getComponentValue()).toBe(value*multiplier_num);
        });
    });

});

afterAll(() => {
    reloadDataBase();
});
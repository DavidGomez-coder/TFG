import { circuit, reloadDataBase } from "../globalDatabase";


beforeAll(() => {
    reloadDataBase();
 });

describe("Comprobar si existen o no elementos añadidos",() => {
    test("Resistencia R0 añadida", () => {
        expect(circuit.getComponentById("R0")).toBeDefined();
    });
    
    test("Condensador C6 añadido", () => {
        expect(circuit.getComponentById("C6")).toBeDefined();
    });
    
    test("Fuente V4 añadida", () => {
        expect(circuit.getComponentById("V4")).toBeDefined();
    });
    
    test("Inductor L2 añadido", () => {
        expect(circuit.getComponentById("L2")).toBeDefined();
    });
    
    test("Interruptor S0 no añadido", () => {
        expect(circuit.getComponentById("S0")).toBeUndefined();
    });
    
    test("Fuente V0 no añadida", () => {
        expect(circuit.getComponentById("V0")).toBeUndefined();
    });
});

afterAll(()=> {
    reloadDataBase();
});
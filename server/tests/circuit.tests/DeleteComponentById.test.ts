/**
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */
import { circuit, circuit2, reloadDataBase} from "../globalDatabase";

beforeAll(() => {
    reloadDataBase();
 });

describe("Añade una resistencia", () => {
    test("Resistencia R0 añadida", () => {
        expect(circuit.getComponentById("R0")).toBeDefined();
    });
});


describe("Circuito sin la resistencia", () => {

    test("Elimina resistencia R0", () => {
        expect(circuit2.getComponentById("R0")).toBeUndefined();
    });
    test("Condensador C6 sigue estando", () => {
        expect(circuit2.getComponentById("C6")).toBeDefined();
    });
    
    test("Fuente V4 sigue estando", () => {
        expect(circuit2.getComponentById("V4")).toBeDefined();
    });
    
    test("Inductor L2 sigue estando", () => {
        expect(circuit2.getComponentById("L2")).toBeDefined();
    });
});


afterAll(()=> {
    reloadDataBase();
});



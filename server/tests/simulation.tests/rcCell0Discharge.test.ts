/**
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */
import { Circuit } from "../../src/model/circuit/Circuit";
import { ComponentsIds } from "../../src/model/circuit/ComponentsIds";
import { Switch } from "../../src/model/component.items/Switch";
import { RcSimulation } from "../../src/model/simulations/RcSimulation";
import { RC_CIRCUIT, reloadDataBase } from "../globalDatabase"

beforeAll(() => {
    reloadDataBase();
});

describe("Si el valor de la fuente es 0, el condensador se descarga", () => {
    let c1: Circuit = RC_CIRCUIT;
    let c2: Circuit = RC_CIRCUIT;

    c1.getComponentById(ComponentsIds.CELL_ID)?.setValue(0);
    (<Switch>c2.getComponentById(ComponentsIds.SWITCH_ID)).changeValue();

    let sim1: RcSimulation = new RcSimulation(c1);
    let sim2: RcSimulation = new RcSimulation(c2);

    test("Estado de descarga si V=0", () => {
        expect(sim1.getResults()).toStrictEqual(sim2.getResults());
    });

});

afterAll (() => {
    reloadDataBase();
});
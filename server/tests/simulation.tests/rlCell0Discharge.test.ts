/**
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */
import { Circuit } from "../../src/model/circuit/Circuit";
import { ComponentsIds } from "../../src/model/circuit/ComponentsIds";
import { Switch } from "../../src/model/component.items/Switch";
import { RlSimulation } from "../../src/model/simulations/RlSimulation";
import { RL_CIRCUIT, reloadDataBase } from "../globalDatabase";

beforeAll(() => {
    reloadDataBase();
});

describe("Si el valor de la fuente es 0, el inductor pierde energía", () => {
    let c1: Circuit = RL_CIRCUIT;
    let c2: Circuit = RL_CIRCUIT;

    c1.getComponentById(ComponentsIds.CELL_ID)?.setValue(0);
    (<Switch>c2.getComponentById(ComponentsIds.SWITCH_ID)).changeValue();

    let sim1: RlSimulation = new RlSimulation(c1);
    let sim2: RlSimulation = new RlSimulation(c2);

    test("Estado de dispación si V=0", () => {
        expect(sim1.getResults()).toStrictEqual(sim2.getResults());
    });

});

afterAll (() => {
    reloadDataBase();
});


/**
  
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { Circuit } from "../model/circuit/Circuit";
import { CircuitSimulation } from "../model/simulations/CircuitSimulation";

export declare module "express-session" {
  interface Session {
    circuitSimulation: string;
  }
}

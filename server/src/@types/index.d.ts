/**
  
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

import { Circuit } from "../model/circuit/Circuit";

export declare module "express-session" {
  interface Session {
    circuit: any;
  }
}

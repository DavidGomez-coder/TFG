/**
 * @fileoverview Representación de los resultados de la simulación de un circuito RL simple
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

export class SimpleRLCircuitResult {
    private t: number;
    private Vl: number;
    private Vr: number;
    private I : number;
    private E : number;
    private fem: number;
    private phi: number;

    constructor (t: number , Vl: number, Vr: number, I: number, E: number, fem: number, phi: number){
        this.t = t;
        this.Vl = Vl;
        this.Vr = Vr;
        this.I = I;
        this.E = E;
        this.fem = fem;
        this.phi = phi;
    }

    getT(): number  { return this.t; }
    getI(): number  { return this.I; }
    getE(): number  { return this.E; }
    getVl(): number { return this.Vl; }
    getVr(): number { return this.Vr; }
    getPhi(): number { return this.phi; }
    getFem(): number { return this.fem; }
}
/**
 * @fileoverview Representación de los resultados de la simulación de un circuito RC simple
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */


export class SimpleRCCircuitResult {
    private t: number;
    private q: number;
    private Vc: number;
    private Vr: number;
    private I : number;
    private E : number;

    constructor (t: number, q: number, Vc: number, Vr: number, I: number, E: number){
        this.t = t;
        this.q = q;
        this.Vc = Vc;
        this.Vr = Vr;
        this.I = I;
        this.E = E;
    }

    getT(): number  { return this.t; }
    getQ(): number  { return this.q; }
    getI(): number  { return this.I; }
    getE(): number  { return this.E; }
    getVc(): number { return this.Vc; }
    getVr(): number { return this.Vr; }
}
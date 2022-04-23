export class SimpleRCCircuitResult {
    private t: number;
    private q: number;
    private Vx: number;
    private Vr: number;
    private I : number;
    private E : number;

    constructor (t: number, q: number, Vx: number, Vr: number, I: number, E: number){
        this.t = t;
        this.q = q;
        this.Vx = Vx;
        this.Vr = Vr;
        this.I = I;
        this.E = E;
    }

    getT(): number  { return this.t; }
    getQ(): number  { return this.q; }
    getI(): number  { return this.I; }
    getE(): number  { return this.E; }
    getVx(): number { return this.Vx; }
    getVr(): number { return this.Vr; }
}
export class Component {
    id: number;
    type: string;

    constructor(id: number, type: string){
        this.id = id;
        this.type = type;
    }

    getId(): number {
        return this.id;
    }

    getType(): string {
        return this.type;
    }

    setId(id: number){
        this.id = id;
    }

    setType(type: string){
        this.type = type;
    }
}
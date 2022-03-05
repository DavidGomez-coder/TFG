import { Component } from "../component.items/Component";

export class Circuit {
    private components: Map<string, Component>;

    constructor(){
        this.components = new Map<string, Component>();
    }

    componentIsDefined(c: Component): boolean{
        return this.components.has(c.getId());
    }
    

    addComponent(c: Component): void{
        if (!this.componentIsDefined(c)){
            this.components.set(c.getId(), c);
        }else{
            console.log(`[SERVER] : Componente con ID:${c.getId()} ya existe`);
        }
    }

    deleteComponent(c: Component): void {
        if (!this.componentIsDefined(c)){
            console.log(`[SERVER] : Componente con ID:${c.getId()} no existe`);
        }else{
            this.components.delete(c.getId());
        }
    }

    //TO-DO
    updateComponent(c: Component): void{
        
    }
}
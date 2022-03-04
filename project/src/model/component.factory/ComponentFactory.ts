import { Component } from "../component.items/Component";


export class ComponentFactory {

    constructor (){}

    createComponent(id: number, type: string): Component {

        return new Component(id, "undefined");
    }
}
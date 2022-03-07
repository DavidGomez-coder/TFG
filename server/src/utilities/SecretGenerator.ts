/**
 * @fileoverview Funciones necesarias para generar un secreto aleatorio correspondiente al 
 * atributo de la sesion. El secreto actual de la sessión ha sido generada usando ese método.
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

export class SecretGenerator {

    private static ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_*$";

    constructor (){}


    /** 
     * Método encargado de crear un session.secret a partir de un alfabeto predefinido. 
     * @param {number} length Longitud de la cadena a generar 
     * @returns {string} Secret
     */
    static generateNewSecret(length: number): string {
        let secret: string = "";
        for (let i=1; i<=length; i++){
            let random_position: number = Math.floor(Math.random()*this.ALPHABET.length);
            secret+=this.ALPHABET[random_position];
        }
        return secret;
    }
}
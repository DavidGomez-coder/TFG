/**
 * @fileoverview Este fichero contiene todas las constantes necesarias y usadas
 * en la obtención del valor real de la capacidad de un condensador
 * 
 * @author David Gómez Pérez <dpgv2000@gmail.com>
 */



let capacitorMults: Map<string, number> = new Map<string, number>();
capacitorMults.set("nanoF",  0.000000001);
capacitorMults.set("microF", 0.000001);
capacitorMults.set("miliF",  0.001);
capacitorMults.set("F",      1);

export {capacitorMults};

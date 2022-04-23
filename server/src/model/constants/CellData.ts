/**
 * @fileoverview Este fichero contiene todas las constantes necesarias y usadas
 * en la obtención del valor real de la tensión de una fuente
 * 
 * @author David Gómez Pérez <dpgv2000@gmail.com>
 */



 let cellMuls: Map<string, number> = new Map<string, number>();
 cellMuls.set("nanoV",  0.000000001);
 cellMuls.set("microV", 0.000001);
 cellMuls.set("miliV",  0.001);
 cellMuls.set("V",      1);
 
 export {cellMuls};
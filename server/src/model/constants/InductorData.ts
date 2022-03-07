/**
 * @fileoverview Este fichero contiene todas las constantes necesarias para la 
 *               obtención del valor real de un inductor
 * 
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

let inductorMuls: Map<string, number> = new Map<string, number>();
inductorMuls.set("nanoH",  0.000000001);
inductorMuls.set("microH", 0.000001);
inductorMuls.set("miliH",  0.001);
inductorMuls.set("H",      1);

export {inductorMuls}
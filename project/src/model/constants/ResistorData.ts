/**
 * @fileoverview Este fichero contiene todas las constantes necesarias para la 
 * construcción de los colores de las bandas de una resistencia.
 * @author David Gómez Pérez <dgpv2000@gmail.com>
 */

let valueBands: Map<number, string> = new Map<number, string>();
valueBands.set(0, "black");     //negro
valueBands.set(1, "#B22222");   //marron
valueBands.set(2, "red");       //rojo
valueBands.set(3, "orange");    //naranja
valueBands.set(4, "yellow");    //amarillo
valueBands.set(5, "green");     //verde
valueBands.set(6, "blue");      //azul
valueBands.set(7, "#4C2882");   //violeta
valueBands.set(8, "gray");      //gris
valueBands.set(9, "white");     //blanco

let multiplerBands: Map<string, string> = new Map<string, string>();
multiplerBands.set("x0.1"  , "gold"    );     //oro
multiplerBands.set("x0.01" , "silver"  );     //plata
multiplerBands.set("x1"    , "black"   );     //negro
multiplerBands.set("x10"   , "#B22222" );     //marron
multiplerBands.set("x100"  , "red"     );     //rojo
multiplerBands.set("x1K"   , "orange"  );     //naranja
multiplerBands.set("x10K"  , "yellow"  );     //amarillo
multiplerBands.set("x100K" , "green"   );     //verde
multiplerBands.set("x1M"   , "blue"    );     //azul
multiplerBands.set("x10M"  , "#4C2882" );     //violeta
multiplerBands.set("x100M" , "gray"    );     //gris
multiplerBands.set("x1G"   , "white"   );     //blanco

let multiplierValues: Map<string, number> = new Map<string, number>();
multiplierValues.set("x0.1"  ,   0.1         );    //oro
multiplierValues.set("x0.01" ,   0.01        );     //plata
multiplierValues.set("x1"    ,   1           );     //negro
multiplierValues.set("x10"   ,   10          );     //marron
multiplierValues.set("x100"  ,   100         );     //rojo
multiplierValues.set("x1K"   ,   1000        );    //naranja
multiplierValues.set("x10K"  ,   10000       );     //amarillo
multiplierValues.set("x100K" ,   100000      );     //verde
multiplierValues.set("x1M"   ,   1000000     );    //azul
multiplierValues.set("x10M"  ,   10000000    );     //violeta
multiplierValues.set("x100M" ,   100000000   );     //gris
multiplierValues.set("x1G"   ,   1000000000  );     //blanco

export {valueBands, multiplerBands, multiplierValues}